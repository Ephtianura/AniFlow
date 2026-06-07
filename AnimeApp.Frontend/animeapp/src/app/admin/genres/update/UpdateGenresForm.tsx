"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import CustomSelect from "@/components/CustomSelect";
import { Genre } from "@/core/types";
import { useRouter } from "next/navigation";
import { useUpdateGenreForm, UpdateGenreValues } from "../../studios/_components/useGenreForm";
import { TagType, tagTypeLabels } from "@/core/enums/TagType";
import { FormProvider } from "react-hook-form";
import GenreGroupList from "../_components/GenreGroupList";

interface Props {
    genres: Genre[];
}

const typeOptions = Object.values(TagType).map(t => ({
    value: t,
    label: tagTypeLabels[t]
}));

export default function UpdateGenrePage({ genres }: Props) {
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const [localType, setLocalType] = useState<TagType>(TagType.Genre);

    const methods = useUpdateGenreForm();
    const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting, isDirty, dirtyFields } } = methods;

    const router = useRouter();

    const hasChanges = isDirty || (selectedGenre && localType !== selectedGenre.type);

    useEffect(() => {
        if (selectedGenre) {
            const initialType = (selectedGenre.type as TagType) || TagType.Genre;
            setLocalType(initialType);
            reset({
                nameUa: selectedGenre.nameUa || "",
                nameEn: selectedGenre.nameEn || "",
                type: initialType,
                slug: selectedGenre.slug || "",
            });
        } else {
            setLocalType(TagType.Genre);
            reset({
                nameUa: "",
                nameEn: "",
                type: TagType.Genre,
                slug: "",
            });
        }
    }, [selectedGenre, reset]);

    const handleTypeChange = (val: string) => {
        const castedType = val as TagType;
        setLocalType(castedType);
        setValue("type", castedType, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true
        });
    };

    const onSubmit = async (data: UpdateGenreValues) => {
        if (!selectedGenre) return;

        const patchBody: Record<string, any> = {
            nameUa: data.nameUa !== selectedGenre.nameUa ? data.nameUa : null,
            nameEn: data.nameEn !== selectedGenre.nameEn ? data.nameEn : null,
            type: localType !== selectedGenre.type ? localType : null,
            slug: data.slug !== selectedGenre.slug ? data.slug : null,
        };

        try {
            await apiFetch(`/genres/${selectedGenre.id}`, {
                method: "PATCH",
                body: JSON.stringify(patchBody),
            });
            toast.success("Жанр успішно оновлено!");
            setSelectedGenre(null);
            reset();
            router.refresh();
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Помилка при оновленні жанру");
        }
    };

    const onError = (errors: any) => {
        const firstError = Object.values(errors)[0] as any;
        if (firstError?.message) {
            toast.error(firstError.message);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col gap-6 w-full">

                {selectedGenre ? (
                    <div className="bg-white p-6 rounded-lg border border-hr-clr shadow-sm space-y-3 mx-auto max-w-xl w-full transition animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Редагувати жанр / тег</h2>
                            <button
                                type="button"
                                onClick={() => setSelectedGenre(null)}
                                className="text-sm primary-link hover:text-purple-700 cursor-pointer"
                            >
                                Скасувати
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-400">Назва UA</label>
                                <input
                                    type="text"
                                    placeholder="Назва UA"
                                    className="btn-primary w-full mt-1"
                                    {...register("nameUa")}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-400">Назва EN</label>
                                <input
                                    type="text"
                                    placeholder="Назва EN"
                                    className="btn-primary w-full mt-1"
                                    {...register("nameEn")}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-400">Слаг ([a-z-])</label>
                                <input
                                    type="text"
                                    placeholder="slug"
                                    className="btn-primary w-full mt-1"
                                    {...register("slug")}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-400">Тип</label>
                                <div className="mt-1">
                                    <CustomSelect
                                        value={localType}
                                        onChange={handleTypeChange}
                                        options={typeOptions}
                                        placeholder="Оберіть тип"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!hasChanges || isSubmitting}
                                className={`select-none w-full py-2 font-medium rounded transition  mt-2 ${hasChanges && !isSubmitting
                                    ? "btn-purple cursor-pointer"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    }`}
                            >
                               Зберегти зміни
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex items-center text-center justify-center p-8 h-109 border-2 border-dashed border-hr-clr rounded-lg text-gray-400 mx-auto max-w-xl w-full">
                        Будь ласка, натисніть на капсулу жанру нижче, щоб відкрити форму редагування.
                    </div>
                )}

                <div className="w-full">
                    <GenreGroupList
                        genres={genres}
                        selectedGenreId={selectedGenre?.id}
                        onSelect={setSelectedGenre}
                        title="Оберіть елемент для редагування:"
                    />
                </div>

            </div>
        </FormProvider>
    );
}