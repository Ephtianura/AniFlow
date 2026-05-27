"use client";

import { useState } from "react";
import { FaListUl } from "react-icons/fa";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import { useUpdateQuery } from "../_functions/useUpdateQuery";

export type ViewMode = "grid" | "gridLarge" | "list";

type Props = {
    view?: ViewMode;
}
export default function ViewModeButton({ view }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>(view || "list");
    const updateQuery = useUpdateQuery();

    const updateView = (view: ViewMode) => {
        if (viewMode === view) return;
        updateQuery("view", view);   
        setViewMode(view);
    }

    return (
        <div className='flex gap-3 items-center text-primary-grey'>
            <button onClick={() => updateView("grid")}
                className={`view-btn ${viewMode === "grid" && "hover:text-white text-white bg-primary"}`}>
                <BsGrid3X3GapFill className='w-7 h-7' />
            </button>

            <button onClick={() => updateView("gridLarge")}
                className={`view-btn  ${viewMode === "gridLarge" && "hover:text-white text-white bg-primary "}`}>
                <IoGrid className='w-7 h-7' />
            </button>

            <button onClick={() => updateView("list")}
                className={`view-btn ${viewMode === "list" && "hover:text-white text-white bg-primary"}`}>
                <FaListUl className='w-7 h-7' />
            </button>
        </div>
    )
}
