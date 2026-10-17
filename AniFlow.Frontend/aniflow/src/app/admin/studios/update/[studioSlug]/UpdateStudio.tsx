"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { Studio } from "@/core/types";

import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";
import { useStudioForm } from "../../create/useStudioForm";
import { StudioNameInput } from "../../_components/StudioNameInput";
import { FormProvider } from "react-hook-form";
import { StudioSearch } from "@/app/admin/_components/StudioSearch";
import { StudioPosterUploader } from "../../_components/StudioPosterUploader";
import { StudioDescription } from "../../_components/StudioDescription";
import { PrimaryButton } from "@/app/admin/_components/PrimaryButton";
import { useRouter } from "next/navigation";
import { LeaveConfirmationModal } from "@/app/admin/_components/LeaveConfirmationModal";

type Props = {
    studio: Studio;
}

export default function UpdateStudio({ studio }: Props) {
    const methods = useStudioForm({
        name: studio.name,
        slug: studio.slug || "",
        malId: studio.malId || null,
        description: studio.description || null,
        poster: {
            file: null,
            url: studio.posterUrl || null
        }
    });

    const { handleSubmit: handleFormSubmit, watch, setValue, reset, formState: { isDirty } } = methods;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formValues = watch();

    // Переинициализируем форму, если пропсы изменятся снаружи
    useEffect(() => {
        reset({
            name: studio.name,
            slug: studio.slug || "",
            malId: studio.malId || null,
            description: studio.description || null,
            poster: {
                file: null,
                url: studio.posterUrl || null
            }
        });
    }, [studio, reset]);

    // Внутри компонента UpdateStudio:
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Оновлення студії...");

        try {
            const payload: Record<string, any> = {};

            const trimmedName = data.name.trim();
            if (trimmedName !== studio.name) {
                payload.name = trimmedName;
            }

            const trimmedSlug = data.slug?.trim() || "";
            const originalSlug = studio.slug || "";
            if (trimmedSlug !== originalSlug) {
                payload.slug = trimmedSlug === "" ? null : trimmedSlug;
            }

            const currentMalId = data.malId === "" ? null : data.malId;
            const originalMalId = studio.malId || null;
            if (currentMalId !== originalMalId) {
                payload.malId = currentMalId;
            }

            const trimmedDesc = data.description?.trim() || "";
            const originalDesc = studio.description || "";
            if (trimmedDesc !== originalDesc) {
                payload.description = trimmedDesc === "" ? null : trimmedDesc;
            }

            // 1. Сначала обновляем текстовые данные студии
            if (Object.keys(payload).length > 0) {
                await apiFetch(`/studios/${studio.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" },
                });
            }

            // Уведомляем об успешном обновлении текстовых полей
            toast.update(toastId, {
                render: "Студія успішно оновлена!",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });

            // 2. Изолированно пробуем загрузить постер в отдельном try-catch block
            if (data.poster.file) {
                const mediaToastId = toast.loading("Завантаження медіа...");
                try {
                    const formData = new FormData();
                    formData.append("Poster", data.poster.file);

                    await apiFetch(`/studios/${studio.id}/files`, {
                        method: "PATCH",
                        body: formData,
                    });

                    toast.update(mediaToastId, {
                        render: "Постер завантажений!",
                        type: "success",
                        isLoading: false,
                        autoClose: 1500
                    });
                } catch (mediaErr: any) {
                    const mediaMessage = Array.isArray(mediaErr.messages) ? mediaErr.messages.find(Boolean) : null;
                    // Если постер упал, закрываем лоадер и выводим ошибку отдельным тостом
                    toast.update(mediaToastId, {
                        render: mediaMessage || "Помилка при завантаженні постера",
                        type: "error",
                        isLoading: false,
                        autoClose: 4000
                    });
                }
            }

            // 3. Выполняем перезагрузку страницы для обновления данных
            const nextSlug = payload.slug !== undefined ? payload.slug : studio.slug;

            if (nextSlug && nextSlug !== studio.slug) {
                // Если слаг изменился, отправляем на новый роут
                // router.push(`/admin/studios/update/${nextSlug}`);
            } else {
                // Если слаг не менялся, жестко обновляем текущие данные сервера и сбрасываем грязную форму
                reset(data);
                router.refresh();
            }

        } catch (err: any) {
            // Сюда попадем только если упал PATCH самой студии (а не постер)
            const message = Array.isArray(err.messages) ? err.messages.find(Boolean) : null;

            toast.update(toastId, {
                render: message ?? getKawaiiError(KawaiiErrorType.Server),
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    const onInvalid = (errors: any) => {
        const firstError = Object.values(errors)[0] as any;
        if (firstError?.message) {
            toast.error(firstError.message);
        } else if (firstError?.file?.message) {
            toast.error(firstError.file.message);
        } else if (firstError?.url?.message) {
            toast.error(firstError.url.message);
        }
    };

    return (
        <div className="flex flex-col gap-6">
           <StudioSearch 
                hrefTemplate="/admin/studios/update/:slug" 
                placeholder="Пошук студії за назвою..." 
            />

            <hr className="text-hr-clr my-0" />

            <FormProvider {...methods}>
                <form onSubmit={handleFormSubmit(onSubmit, onInvalid)} className="flex flex-col gap-6">

                    <StudioNameInput
                        value={formValues.name}
                        onChange={(val) => setValue("name", val, { shouldValidate: true, shouldDirty: true })}
                    />

                    <div className="flex flex-col  gap-4 justify-between w-full items-start">
                        <div className="flex flex-col md:flex-row gap-4 flex-1 items-center md:items-start w-full">
                            <StudioPosterUploader
                                posterPreview={formValues.poster.url}
                                onChange={(file) => setValue("poster", {
                                    file,
                                    url: file ? URL.createObjectURL(file) : null
                                }, { shouldValidate: true, shouldDirty: true })}
                            />

                            <div className="flex-1 w-full">
                                <StudioDescription
                                    value={formValues.description || ""}
                                    onChange={(val) => setValue("description", val || null, { shouldValidate: true, shouldDirty: true })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full border border-hr-clr p-4 rounded-lg bg-gray-50 ">
                            <label className="flex flex-col w-full md:w-auto gap-1 text-sm ">
                                <span className="font-medium">Слаг</span>
                                <input
                                    type="text"
                                    value={formValues.slug || ""}
                                    onChange={(e) => setValue("slug", e.target.value || null, { shouldValidate: true, shouldDirty: true })}
                                    className="border border-hr-clr rounded p-2 bg-white outline-none focus:border-purple-500"
                                    placeholder="Генерується автоматично"
                                />
                            </label>

                            <label className="flex flex-col w-full md:w-auto gap-1 text-sm ">
                                <span className="font-medium">MyAnimeList ID</span>
                                <input
                                    type="number"
                                    value={formValues.malId ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setValue("malId", val === "" ? null : Number(val), { shouldValidate: true, shouldDirty: true });
                                    }}
                                    className="border border-hr-clr rounded p-2  bg-white outline-none focus:border-purple-500"
                                    placeholder="Введіть MAL ID"
                                />
                            </label>
                        </div>
                    </div>

                    <PrimaryButton type="submit" disabled={!isDirty || isSubmitting}>
                        Оновити студію
                    </PrimaryButton>
                </form>
            </FormProvider>
            <LeaveConfirmationModal isDirty={isDirty} />
        </div>
    );
}