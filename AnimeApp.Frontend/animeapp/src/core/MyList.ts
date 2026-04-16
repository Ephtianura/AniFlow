// Відображення статусів у зрозумілі назви
export const MyListMap: Record<string, string> = {
  Planned: "Заплановано",
  Watching: "Дивлюсь",
  Completed: "Переглянуто",
  Rewatching: "Переглядаю знову",
  On_hold: "Відкладено",
  Dropped: "Кинуто",
};

// Enum синхронізований з бекендом (.NET)
export enum MyListEnum {
  Planned,
  Watching,
  Completed,
  Rewatching,
  On_hold,
  Dropped,
}
