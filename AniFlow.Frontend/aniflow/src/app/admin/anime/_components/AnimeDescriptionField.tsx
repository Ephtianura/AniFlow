"use client";

import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
//@ts-ignore
import "easymde/dist/easymde.min.css";

interface AnimeDescriptionFieldProps {
    isEditMode?: boolean;
    value?: string | null;
    onChange?: (val: string | null) => void;
}

export function AnimeDescriptionField({ isEditMode, value, onChange }: AnimeDescriptionFieldProps) {
    const { control } = useFormContext();

    const options = useMemo<EasyMDE.Options>(() => {
        return {
            spellChecker: false,
            maxHeight: "300px",
            placeholder: "Додайте опис аніме... (Підтримує Ctrl+B, Ctrl+I, Ctrl+K)",
            toolbar: [
                "bold",
                "italic",
                "heading",
                "|",
                "quote",
                "unordered-list",
                "ordered-list",
                "|",
                "link",
                "|",
                "preview",
                "side-by-side",
                "fullscreen"
            ] as const,
        };
    }, []);

    if (isEditMode) {
        return (
            <div className="sm:col-span-2 md:col-span-3 flex flex-col gap-1 w-full min-w-0">
                <label className="font-medium text-gray-700 text-sm">Опис аніме</label>

                <div className="prose max-w-none min-h-50 w-full min-w-0 overflow-hidden">
                    <SimpleMDE
                        value={value || ""}
                        onChange={(val) => {
                            const finalValue = !val || val.trim() === "" ? null : val;
                            if (onChange) onChange(finalValue);
                        }}
                        options={options}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="sm:col-span-2 md:col-span-3 flex flex-col gap-1  w-full min-w-0">
            <label className="font-medium text-gray-700 text-sm">Опис аніме</label>
            <Controller
                name="description"
                control={control}
                render={({ field: { value: cv, onChange: coC, onBlur } }) => (
                    <div className="prose max-w-none min-h-50 w-full min-w-0 overflow-hidden">
                        <SimpleMDE
                            value={cv || ""}
                            onChange={(val) => {
                                const finalValue = !val || val.trim() === "" ? null : val;
                                coC(finalValue);
                            }}
                            onBlur={onBlur}
                            options={options}
                        />
                    </div>
                )}
            />
        </div>
    );
}