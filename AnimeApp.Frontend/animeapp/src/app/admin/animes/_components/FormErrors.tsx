"use client";

import React from "react";

interface FormErrorsProps {
    errors: Record<string, string[]>;
}

export const FormErrors: React.FC<FormErrorsProps> = ({ errors }) => {
    if (Object.keys(errors).length === 0) return null;

    return (
        <div className="mt-4 p-4 border-2 border-red-400 bg-red-100 rounded">
            <h3 className="text-red-600 font-bold mb-2">Помилки валідації:</h3>
            <ul className="list-disc list-inside text-red-600">
                {Object.entries(errors).map(([field, msgs]) =>
                    msgs.map((msg, i) => (
                        <li key={`${field}-error-${i}`}>
                            {field}: {msg}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
