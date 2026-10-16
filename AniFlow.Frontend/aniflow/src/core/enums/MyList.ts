  export enum MyListEnum {
      Planned = "Planned",
      Watching = "Watching",
      Completed = "Completed",
      Rewatching = "Rewatching",
      On_hold = "On_hold",
      Dropped = "Dropped"
  }

  export const MyListMap: Record<string, string> = {
    Planned: "Заплановано",
    Watching: "Дивлюсь",
    Completed: "Переглянуто",
    Rewatching: "Переглядаю знову",
    On_hold: "Відкладено",
    Dropped: "Кинуто",
  };