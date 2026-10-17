export enum SeasonEnum {
  Winter = "Winter",
  Spring = "Spring",
  Summer = "Summer",
  Fall = "Fall",
}
export const SeasonMap: Record<string, string> = {
  Winter: "Зима",
  Spring: "Весна",
  Summer: "Літо",
  Fall: "Осінь",
};

export const SeasonTextMap: Record<SeasonEnum, string> = {
  [SeasonEnum.Spring]: "весняного",
  [SeasonEnum.Summer]: "літнього",
  [SeasonEnum.Fall]: "осіннього",
  [SeasonEnum.Winter]: "зимового",
}

export function getCurrentSeason(): SeasonEnum {
  const month = new Date().getMonth() + 1

  if (month >= 4 && month <= 6) return SeasonEnum.Spring
  if (month >= 7 && month <= 9) return SeasonEnum.Summer
  if (month >= 10 && month <= 12) return SeasonEnum.Fall

  return SeasonEnum.Winter
}