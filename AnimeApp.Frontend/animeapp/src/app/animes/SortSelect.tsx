'use client';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { HiChevronDown } from 'react-icons/hi2'; 

const sortOptions = [
    { id: 'Score', name: 'Рейтингу' },
    { id: 'Title', name: 'Назві' },
    { id: 'Episodes', name: 'Епізодам' },
    { id: 'AiredOn', name: 'Початку виходу' },
    { id: 'ReleasedOn', name: 'Кінцю виходу' },
];

export default function SortSelect({ sortBy, setSortBy }: any) {
    const selectedOption = sortOptions.find(opt => opt.id === sortBy) || sortOptions[0];

    return (
        <div className="relative w-44">
            <Listbox value={sortBy} onChange={setSortBy}>
                <ListboxButton
                    className="relative flex w-full items-center justify-between px-3 py-1.5 text-left text-sm text-primary-black shadow-sm rounded-xs border border-btn-border-light bg-white
                     hover:bg-btn-hover transition focus:outline-none focus:border-btn-border-dark"
                >
                    {selectedOption.name}
                    <HiChevronDown className="w-4 h-4 text-gray-400" />
                </ListboxButton>

                {/* Выпадающий список */}
                <ListboxOptions
                    transition
                    anchor="bottom start"
                    className="z-50 w-(--button-width) mt-1 rounded-xs border border-btn-border-light bg-white py-2 shadow-lg ring-1 ring-black/5 transition duration-100 ease-in data-[closed]:opacity-0"
                >
                    {sortOptions.map((option) => (
                        <ListboxOption
                            key={option.id}
                            value={option.id}
                            className="group flex cursor-pointer items-center gap-2 px-3 py-1.5 select-none 
                         data-focus:bg-primary data-focus:text-white transition-colors"
                        >
                            {/* Тут можно добавить иконку галочки, если нужно */}
                            <span className="text-sm">{option.name}</span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div>
    );
}