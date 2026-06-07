"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { Studio } from "@/core/types";
import { StudioNameInput } from "../_components/StudioNameInput";
import { StudioDescription } from "../_components/StudioDescription";
import { StudioPosterUploader } from "../_components/StudioPosterUploader";
import { PrimaryButton } from "../../_components/PrimaryButton";
import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";
import { useStudioForm } from "./useStudioForm";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

export default function CreateStudioForm() {
    const methods = useStudioForm();
    const { handleSubmit: handleFormSubmit, watch, setValue, reset } = methods;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const formValues = watch();

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        let createdStudio: Studio | null = null;
        const toastId = toast.loading("Створення студії...");

        try {
            const payload = {
                name: data.name.trim(),
                description: data.description?.trim() || "",
            };

            createdStudio = await apiFetch<Studio>("/studios", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            toast.update(toastId, {
                render: "Студія успішно створена!",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });

        } catch (err: any) {
            const message = Array.isArray(err.messages)
                ? err.messages.find(Boolean)
                : null;

            toast.update(toastId, {
                render: message ?? getKawaiiError(KawaiiErrorType.Server),
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            setIsSubmitting(false);
            return;
        }

        if (data.poster.file && createdStudio?.id) {
            const mediaToastId = toast.loading("Завантаження медіа...");

            try {
                const formData = new FormData();
                formData.append("Poster", data.poster.file);

                await apiFetch(`/studios/${createdStudio.id}/files`, {
                    method: "PATCH",
                    body: formData,
                });

                toast.update(mediaToastId, {
                    render: "Постер завантажений!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });

                reset();
                router.push(`/admin/studios/update/${createdStudio.id}`); 

            } catch (err: any) {
                const message = Array.isArray(err.messages)
                    ? err.messages.find(Boolean)
                    : null;
                toast.update(mediaToastId, {
                    render: message || "Помилка при завантаженні медіа",
                    type: "error",
                    isLoading: false,
                    autoClose: 4000
                });

                router.push(`/admin/studios/update/${createdStudio.id}`);
            }
        } else {
            reset();
            if (createdStudio?.slug) {
                router.push(`/admin/studios/update/${createdStudio.id}`);
            }
        }

        setIsSubmitting(false);
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
        <FormProvider {...methods}>
            <form onSubmit={handleFormSubmit(onSubmit, onInvalid)} className="flex flex-col gap-6">

                <StudioNameInput 
                    value={formValues.name} 
                    onChange={(val) => setValue("name", val, { shouldValidate: true })} 
                />

                <hr className="text-hr-clr" />

                <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-center md:items-start">
                    <StudioPosterUploader 
                        posterPreview={formValues.poster.url} 
                        onChange={(file) => setValue("poster", {
                            file,
                            url: file ? URL.createObjectURL(file) : null
                        }, { shouldValidate: true })} 
                    />

                    <div className="flex-1 w-full">
                        <StudioDescription 
                            value={formValues.description || ""} 
                            onChange={(val) => setValue("description", val || null, { shouldValidate: true })} 
                        />
                    </div>
                </div>

                <PrimaryButton type="submit" disabled={isSubmitting}>
                    Створити студію
                </PrimaryButton>
            </form>
        </FormProvider>
    );
}