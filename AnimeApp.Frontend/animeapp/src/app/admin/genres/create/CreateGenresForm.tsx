"use client";

import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import CustomSelect from "@/components/CustomSelect";
import GenreCapsule from "../_components/GenreCapsule";
import { Genre } from "@/core/types";
import { useRouter } from "next/navigation";
import { useCreateGenreForm, CreateGenreValues } from "../../studios/_components/useGenreForm";
import { TagType, tagTypeLabels } from "@/core/enums/TagType";
import { FormProvider } from "react-hook-form";
import GenreGroupList from "../_components/GenreGroupList";

interface Props {
    genres: Genre[];
}

export default function CreateGenrePage({ genres }: Props) {
    const methods = useCreateGenreForm();
    const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = methods;

    const router = useRouter();
    const currentType = watch("type");

    const onSubmit = async (data: CreateGenreValues) => {
        try {
            await apiFetch("/genres", {
                method: "POST",
                body: JSON.stringify(data),
            });
            toast.success("Жанр успішно створено!");
            reset();
            router.refresh();
        } catch (err: any) {
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;
            toast.error(message || "Помилка при створенні жанру");
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
            <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-lg border border-hr-clr shadow-sm space-y-3 mx-auto max-w-xl w-full">
                    <h2 className="text-xl font-bold text-gray-800">Створити новий жанр / тег</h2>

                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Назва UA"
                                className="btn-primary w-full"
                                {...register("nameUa")}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Назва EN"
                                className="btn-primary w-full"
                                {...register("nameEn")}
                            />
                        </div>

                        <div>
                            <CustomSelect
                                value={currentType}
                                onChange={(val) => setValue("type", val as TagType)}
                                options={typeOptions}
                                placeholder="Оберіть тип"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-purple w-full py-2 font-medium disabled:opacity-50 "
                        >
                            Створити
                        </button>
                    </form>
                </div>

                <hr className="border-gray-200" />
                <GenreGroupList
                    genres={genres} title={"Існуючі елементи в базі:"}
                />
            </div>
        </FormProvider>
    );
}

const typeOptions = Object.values(TagType).map(t => ({
    value: t,
    label: tagTypeLabels[t]
}));