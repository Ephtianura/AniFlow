// Відображення статусів у зрозумілі назви
export const MyListMap: Record<string, string> = {
  None: "Без списку",
  Planned: "Заплановано",
  Watching: "Дивлюсь",
  Completed: "Переглянуто",
  Rewatching: "Переглядаю знову",
  On_hold: "Відкладено",
  Dropped: "Кинуто",
};

// Enum повністю синхронізований з бекендом (.NET)
export enum MyListEnum {
  None = 0,
  Planned = 1,
  Watching = 2,
  Completed = 3,
  Rewatching = 4,
  On_hold = 5,
  Dropped = 6,
}
