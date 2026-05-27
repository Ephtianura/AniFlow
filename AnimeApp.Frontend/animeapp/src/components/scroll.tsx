"use client"
import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

// Данные для вкладок (как на твоем первом скрине)
const categories = [
  { id: 'watched', label: 'Просмотрено', count: 64 },
  { id: 'on_hold', label: 'Отложено', count: 0 },
  { id: 'dropped', label: 'Брошено', count: 2 },
  { id: 'planned', label: 'Запланировано', count: 22 },
  { id: 'rewatching', label: 'Пересматриваю', count: 1 },
];

export default function AnimeTabs() {
  const [selected, setSelected] = React.useState('watched');

  return (
    <div className="w-full max-w-4xl bg-[#1a1a1a] p-4 rounded-xl text-white">
      {/* ScrollMenu активирует скролл пальцем на смартфонах 
        и перетаскивание мышкой на компьютерах
      */}
      <ScrollMenu 
        LeftArrow={LeftArrow} 
        RightArrow={RightArrow}
        wrapperClassName="overflow-hidden" // Прячем дефолтный системный скроллбар
      >
        {categories.map(({ id, label, count }) => (
          <TabItem
            key={id}
            itemId={id} // Важно для библиотеки
            label={label}
            count={count}
            selected={selected === id}
            onClick={() => setSelected(id)}
          />
        ))}
      </ScrollMenu>
    </div>
  );
}

// ---- КОМПОНЕНТ ОДНОЙ ВКЛАДКИ ----
function TabItem({ label, count, selected, onClick, itemId }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        mx-2 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap select-none
        ${selected 
          ? 'bg-zinc-700 text-white shadow-md' 
          : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
        }
      `}
    >
      <span>{label}</span>
      {count > 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded-md ${selected ? 'bg-zinc-600' : 'bg-zinc-700'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ---- СТРЕЛОЧКИ ДЛЯ ПК (Появляются/исчезают автоматически) ----
function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = React.useContext(VisibilityContext);
  return (
    <button
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      className={`p-2 text-zinc-400 hover:text-white disabled:opacity-0 transition-opacity`}
    >
      &lt; {/* Иконка левой стрелки */}
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);
  return (
    <button
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      className={`p-2 text-zinc-400 hover:text-white disabled:opacity-0 transition-opacity`}
    >
      &gt; {/* Иконка правой стрелки */}
    </button>
  );
}