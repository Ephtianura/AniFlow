"use client";

import { AnimeTitlesEditor } from "../_components/AnimeTitlesEditor";
import { AnimePosterUploader } from "../_components/AnimePosterUploader";
import { AnimeGenresSelector } from "../_components/AnimeGenresSelector";
import { AnimeStudioSelector } from "../_components/AnimeStudioSelector";
import { AnimeMainData } from "../_components/AnimeMainData";
import { PrimaryButton } from "../../_components/PrimaryButton";
import { AnimeFormValues, useAnimeForm } from "../_components/useAnimeForm";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";
import { AnimeCreateResponse, Genre } from "@/core/types";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";
import { LeaveConfirmationModal } from "../../_components/LeaveConfirmationModal";

type Props = {
    genres: Genre[]
}

export default function CreateAnimeForms({ genres }: Props) {
    if (!genres) toast.warning("Не вдалося завантажити жанри")

    const methods = useAnimeForm();

    const router = useRouter()

    const { isDirty, isSubmitting } = methods.formState;
    const shouldBlock = isDirty && !isSubmitting;

    const onSubmit = async (data: AnimeFormValues) => {
        let animeId: number | null = null;
        let animeSlug: string | null = null;
        const toastId = toast.loading("Створення аніме...");

        try {
            const { poster, ...jsonPayload } = data;

            // Основне створення текстового аніме
            const createdAnime = await apiFetch<AnimeCreateResponse>("/anime", {
                method: "POST",
                body: JSON.stringify(jsonPayload),
                headers: { "Content-Type": "application/json" }
            });

            animeId = createdAnime.id;
            animeSlug = createdAnime.url

            // Успіх 1
            toast.update(toastId, {
                render: "Аніме створено!",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });

        } catch (err: any) {
            const message = Array.isArray(err.messages)
                ? err.messages.find(Boolean)
                : null;

            // Якщо текст упав медіа не надсилаємо
            toast.update(toastId, {
                render: message ?? getKawaiiError(KawaiiErrorType.Server),
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            return;
        }

        // Медіа
        if (data.poster?.file || data.poster?.url) {
            const mediaToastId = toast.loading("Завантаження медіа...");

            try {
                const formData = new FormData();

                if (data.poster.file) {
                    formData.append("Poster", data.poster.file);
                } else if (data.poster.url) {
                    formData.append("PosterUrl", data.poster.url);
                }

                await apiFetch(`/anime/${animeId}/files`, {
                    method: "PATCH",
                    body: formData,
                });

                // Успіх 2
                toast.update(mediaToastId, {
                    render: "Постер завантажений!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                // Резет тільки якщо успішно
                methods.reset();
                router.push(`/admin/anime/update/${animeSlug}`)

            } catch (err: any) {
                // Якщо текст створився но медіа впали
                toast.update(mediaToastId, {
                    render: err.message || "Помилка при завантаженні медіа",
                    type: "error",
                    isLoading: false,
                    autoClose: 4000
                });
            }
        } else {
            methods.reset();
            router.push(`/admin/anime/update/${animeSlug}`)
        }
    };

    return (
        <FormProvider {...methods}>
            <LeaveConfirmationModal isDirty={shouldBlock} />
            {/* Форма */}
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col items-center md:items-start md:flex-row justify-between gap-6">
                    {/* Назви */}
                    <div className="order-2 md:order-1 w-full md:w-auto">
                        <AnimeTitlesEditor />
                    </div>

                    {/* Постер */}
                    <div className="order-1 md:order-2">
                        <AnimePosterUploader />
                    </div>
                </div>

                <hr className="text-hr-clr" />

                {/* Жанри */}
                <AnimeGenresSelector genres={genres} />

                <hr className="text-hr-clr" />

                {/* Студія */}
                <div className="w-full">
                    <AnimeStudioSelector />
                </div>

                <hr className="text-hr-clr" />

                {/* Основні дані */}
                <AnimeMainData />

                {/* Submit */}
                <PrimaryButton
                    type="submit"
                    disabled={methods.formState.isSubmitting}
                >
                    Створити аніме
                </PrimaryButton>

            </form>
        </FormProvider>
    );
}
