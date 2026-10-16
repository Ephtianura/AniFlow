"use client";

import { useState } from "react";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import clsx from "clsx";
import { useUpdateQuery } from "../_functions/useUpdateQuery";

export default function SortDescButton() {
    const [sortDesc, setSortDesc] = useState(true);

    const updateQuery = useUpdateQuery();

    const updateSortDesc = (sort: boolean) => {
        if (sort === sortDesc) return;
        updateQuery("sortDesc", String(sort)); //принимает только стринг
        setSortDesc(sort);
    }

    return (
        <div>
            <button
                onClick={() => updateSortDesc(!sortDesc)}
                className={clsx(
                    "text-primary-black p-2 mt-px border border-btn-border-light rounded-xs bg-white cursor-pointer",
                    "hover:bg-btn-hover transition",
                    "active:scale-95 active:bg-gray-200 active:border-gray-300"
                )}
            >
                {sortDesc
                    ? <FaSortAlphaDownAlt className="w-5 h-5" />
                    : <FaSortAlphaDown className="w-5 h-5" />
                }
            </button>
        </div>
    )
}
