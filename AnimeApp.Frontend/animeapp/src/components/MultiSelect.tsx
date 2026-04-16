'use client';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { FaSort } from 'react-icons/fa';

// Добавляем TId для типа идентификатора
interface MultiSelectProps<T, TId extends string | number> {
  options: T[];
  selectedIds: TId[]; // Теперь тип совпадает со стейтом
  onChange: (ids: TId[]) => void;
  idKey: keyof T;
  labelKey: keyof T;
  placeholder?: string;
  className?: string;
}

// Указываем оба дженерика в функции
export default function MultiSelect<T, TId extends string | number>({
  options,
  selectedIds,
  onChange,
  idKey,
  labelKey,
  placeholder = "Оберіть...",
  className = ""
}: MultiSelectProps<T, TId>) {
  
  const handleToggle = (id: TId) => {
    // TypeScript теперь знает, что id того же типа, что и элементы массива
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(item => item !== id)
      : [...selectedIds, id];
    onChange(newSelection);
  };

  const buttonText = options
    .filter(opt => selectedIds.includes(opt[idKey] as unknown as TId))
    .map(opt => opt[labelKey])
    .join(", ") || placeholder;

  return (
    <Popover className={`relative w-full ${className}`}>
      <PopoverButton className="btn-primary flex items-center justify-between w-full h-[38px] text-left outline-none">
        <span className="truncate pr-2 text-primary-black">{buttonText}</span>
        <FaSort className="w-4 h-4 text-gray-text-dark shrink-0" />
      </PopoverButton>

      <PopoverPanel
        transition
        anchor="bottom start"
        className="z-100 w-(--button-width) py-1 mt-1 bg-white border border-btn-border-light rounded shadow-lg h-70 overflow-y-auto transition duration-100 ease-in data-closed:opacity-0"
      >
        <div className="py-1">
          {options.map((option, index) => {
            const id = option[idKey] as unknown as TId;
            const label = option[labelKey] as unknown as string;
            const isChecked = selectedIds.includes(id);

            return (
              <label
                key={String(id) || index}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer select-none transition-colors"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border border-btn-border-light rounded bg-white 
                               checked:bg-primary checked:border-primary transition-all cursor-pointer"
                    checked={isChecked}
                    onChange={() => handleToggle(id)}
                  />
                  <svg
                    className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px] top-[3px] transition-opacity"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                
                <span className={`ml-3 text-sm ${isChecked ? 'text-primary-black font-medium' : 'text-gray-600'}`}>
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </PopoverPanel>
    </Popover>
  );
}