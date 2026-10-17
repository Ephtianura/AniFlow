export enum OstType {
  Other = "Other",
  Opening = "Opening",
  Ending = "Ending",
  Insert = "Insert",
}

export const OstTypeMap: Record<OstType, string> = {
  [OstType.Other]: "Інше",
  [OstType.Opening]: "Опенінг",
  [OstType.Ending]: "Ендінг",
  [OstType.Insert]: "Insert",
};