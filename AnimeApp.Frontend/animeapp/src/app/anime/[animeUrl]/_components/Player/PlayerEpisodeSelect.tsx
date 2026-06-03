'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FaSort } from 'react-icons/fa';

interface Option<T> {
  value: T;
  label: string;
}

interface UniversalSelectProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  placeholder?: string;
  className?: string;
}

export default function PlayerEpisodeSelect<T>({
  value,
  onChange,
  options,
  placeholder = "",
  className = ""
}: UniversalSelectProps<T>) {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative select-none grow`}>
      <Listbox value={value} onChange={onChange}>

        <ListboxButton className={`w-full border border-[#6C757D] rounded-lg px-4 py-2 grow text-center 
        data-open:border-primary data-open:ring-2 data-open:ring-primary/50 transition
        data-open:bg-[#6c757d]`}>
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          anchor="bottom start"
          className="z-20 w-(--button-width) mt-1 rounded-xs border py-2 
          shadow-lg transition duration-100 ease-in data-closed:opacity-0 bg-[#303031]"
          modal={false}
        >
          {options.map((option, idx) => (
            <ListboxOption
              key={idx}
              value={option.value}
              className="group flex cursor-pointer items-center px-3 py-2 select-none 
                         data-focus:bg-primary data-focus:text-white transition-colors bg-[#333334] text-white text-sm"
            >
              <span className="truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>

      </Listbox>
    </div>
  );
}