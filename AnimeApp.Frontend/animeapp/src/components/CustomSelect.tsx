'use client';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FaSort } from 'react-icons/fa';

interface Option {
  value: string | null;
  label: string;
}

interface UniversalSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Оберіть зі списку",
  className = ""
}: UniversalSelectProps) {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative w-full ${className}`}>
      <Listbox value={value} onChange={onChange}>
        <ListboxButton className="btn-primary w-full text-left flex justify-between items-center h-[38px]">
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FaSort className="text-gray-text-dark shrink-0 ml-2" />
        </ListboxButton>

        <ListboxOptions
          transition
          anchor="bottom start"
          className="z-100 w-(--button-width) mt-1 rounded-xs border border-btn-border-light bg-white py-2 shadow-lg transition duration-100 ease-in data-[closed]:opacity-0"
        >
          {options.map((option, idx) => (
            <ListboxOption
              key={idx}
              value={option.value}
              className="group flex cursor-pointer items-center px-3 py-2 select-none 
                         data-focus:bg-primary data-focus:text-white transition-colors text-primary-black text-sm"
            >
              <span className="truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}