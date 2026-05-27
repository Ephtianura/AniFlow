import { getKawaiiError, KawaiiErrorType } from "@/hooks/getKawaiiError";

export function parseApiErrors(res: Response, data: any): string[] {
  try {
    if (!data) {
      return [getKawaiiError(KawaiiErrorType.Server)];
    }

    // Default  error
    if (data.error && typeof data.error === "string") {
      return [data.error];
    }

    // FluentValidation RFC 7807
    if (data.errors && typeof data.errors === "object") {
      return Object.values(data.errors).flat() as string[];
    }

    // Інше
    if (data.message) return [data.message];
    if (data.title) return [data.title];
    if (data.error) return [data.error];

    return [getKawaiiError(KawaiiErrorType.Server)];
  } catch (e) {
    return [getKawaiiError(KawaiiErrorType.Server)];
  }
}
