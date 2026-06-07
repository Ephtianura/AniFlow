"use client";

import { useState, useRef } from "react";
import { 
    DndContext, 
    closestCenter, 
    MouseSensor, 
    TouchSensor, 
    useSensor, 
    useSensors, 
    DragEndEvent 
} from "@dnd-kit/core";
import { 
    SortableContext, 
    rectSortingStrategy, 
    useSortable, 
    arrayMove 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import ScreenshotHoverPreview from "./ScreenshotHoverPreview"; // Импортируем наше превью

type ScreenshotItem = {
    id: string;
    previewUrl: string;
    isUploading?: boolean;
};

type Props = {
    items: ScreenshotItem[];
    setItems: React.Dispatch<React.SetStateAction<any[]>>; 
    onRemove: (id: string) => void;
};

export default function SortableScreenshotGrid({
    items,
    setItems,
    onRemove,
}: Props) {
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, 
                tolerance: 5, 
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            setItems((prevItems) => {
                const oldIndex = prevItems.findIndex((item) => item.id === active.id);
                const newIndex = prevItems.findIndex((item) => item.id === over.id);
                return arrayMove(prevItems, oldIndex, newIndex);
            });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div
                    className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-2 min-h-25 p-1
                     bg-gray-100 rounded-md border border-dashed border-gray-300 max-h-200 overflow-y-auto overflow-x-hidden transparent-scroll`}
                >
                    {items.map((item, index) => (
                        <SortableItem
                            key={item.id}
                            item={item}
                            index={index}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableItem({
    item,
    index,
    onRemove,
}: {
    item: ScreenshotItem;
    index: number;
    onRemove: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    // Локальное состояние для показа плавного превью
    const [showPreview, setShowPreview] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        // Если карточка тащится — z-50. Если на неё просто навели и она увеличилась — z-40, чтобы перекрыть соседей.
        zIndex: isDragging ? 50 : showPreview ? 40 : 1, 
    };

    const handleMouseEnter = () => {
        if (item.isUploading || isDragging) return;
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        // Небольшой таймаут в 400мс, чтобы превью не стреляло при быстром пролёте курсора
        hoverTimeoutRef.current = setTimeout(() => {
            setShowPreview(true);
        }, 1000);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setShowPreview(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseLeave} // Сбрасываем превью сразу при клике/начале драга
            className={`relative rounded overflow-hidden aspect-video bg-black border group shadow-sm transition-shadow ${
                isDragging
                    ? "shadow-2xl ring-2 ring-purple-400 opacity-80"
                    : "border-gray-200"
            }`}
        >
            {/* Наш вынесенный компонент всплывающего превью */}
            {!item.isUploading && (
                <ScreenshotHoverPreview src={item.previewUrl} isVisible={showPreview} />
            )}

            <img
                src={item.previewUrl}
                alt="screenshot"
                loading="lazy"
                className={`w-full h-full object-cover select-none ${
                    item.isUploading ? "opacity-40" : ""
                }`}
            />

            <div
                {...attributes}
                {...listeners}
                className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity z-5 ${
                    item.isUploading
                        ? "pointer-events-none opacity-0"
                        : "opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                }`}
            >
                {!item.isUploading && (
                    <MdDragIndicator className="w-8 h-8 text-white drop-shadow" />
                )}
            </div>

            {item.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <button
                type="button"
                onDoubleClick={() => {
                    handleMouseLeave();
                    onRemove(item.id);
                }}
                className={`absolute top-1 right-1 bg-red-400/80 hover:bg-red-600 text-white w-6 h-6 flex items-center 
                justify-center rounded-full transition active:scale-95 z-10 cursor-pointer shadow`}
            >
                <IoClose className="w-4 h-4" />
            </button>

            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none select-none">
                #{index + 1}
            </span>
        </div>
    );
}