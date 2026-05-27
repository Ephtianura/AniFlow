export enum OstType {
  Other,
  Opening,
  Ending,
  Insert,
}

export const OstTypeMap: Record<OstType, string> = {
  [OstType.Other]: "Інше",
  [OstType.Opening]: "Опенінг",
  [OstType.Ending]: "Ендінг",
  [OstType.Insert]: "Insert",
};