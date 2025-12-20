// src/core/enums/SeasonEnum.ts
export enum SeasonEnum {
  Unknown = 0,
  Winter = 1,
  Spring = 2,
  Summer = 3,
  Fall = 4,
}

// Переводы
export const SeasonMap: Record<string, string> = {
  Unknown: "Невідомо",
  Winter: "Зима",
  Spring: "Весна",
  Summer: "Літо",
  Fall: "Осінь",
};
