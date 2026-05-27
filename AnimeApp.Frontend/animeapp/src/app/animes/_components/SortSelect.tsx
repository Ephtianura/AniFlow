'use client';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import { useUpdateQuery } from '../_functions/useUpdateQuery';
import { AnimeSortBy } from '@/core/enums/AnimeSortBy';
import clsx from 'clsx';

const sortOptions = [
    { id: AnimeSortBy.Score, name: 'Рейтингу' },
    { id: AnimeSortBy.Title, name: 'Назві' },
    { id: AnimeSortBy.CreatedAt, name: 'Даті додавання' },
    { id: AnimeSortBy.Episodes, name: 'Епізодам' },
    { id: AnimeSortBy.AiredOn, name: 'Початку виходу' },
    { id: AnimeSortBy.ReleasedOn, name: 'Кінцю виходу' },
];

type Props = {
    initSortBy?: AnimeSortBy
}
export default function SortSelect({ initSortBy }: Props) {
    const [sortBy, setSortBy] = useState<AnimeSortBy>(initSortBy || AnimeSortBy.Score);
    const updateQuery = useUpdateQuery();

    const updateView = (sortByParam: AnimeSortBy) => {
        if (sortByParam === sortBy) return;
        updateQuery("sortBy", sortByParam);
        setSortBy(sortByParam);
    }

    const selectedOption = sortOptions.find(opt => opt.id === sortBy) || sortOptions[0];

    return (
        <div className="relative w-35 sm:w-44 select-none">
            <Listbox value={sortBy} onChange={updateView}>
                <ListboxButton
                    className={clsx(
                        "relative flex w-full items-center justify-between px-3 py-1.5 text-left ",
                        "text-primary-black shadow-sm rounded-xs ",
                        "border border-btn-border-light bg-white",
                        "hover:bg-btn-hover transition focus:outline-none focus:border-btn-border-dark cursor-pointer "
                    )}
                >
                    {selectedOption.name}
                    <HiChevronDown className="w-4 h-4 text-gray-400" />
                </ListboxButton>

                {/* Выпадающий список */}
                <ListboxOptions
                    transition
                    anchor="bottom start"
                    className="z-50 w-(--button-width) outline-none mt-1 rounded-xs border border-btn-border-light bg-white py-2 shadow-lg ring-1 ring-black/5 transition duration-100 ease-in data-[closed]:opacity-0"
                >
                    {sortOptions.map((option) => (
                        <ListboxOption
                            key={option.id}
                            value={option.id}
                            className="group flex cursor-pointer items-center gap-2 px-3 py-1.5 select-none 
                         data-focus:bg-primary data-focus:text-white transition-colors"
                        >
                            {/* Тут можно добавить иконку галочки */}
                            <span className="text-sm">{option.name}</span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div >
    );
}