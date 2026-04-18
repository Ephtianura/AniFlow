import { ApiErrorResponse } from "@/core/types";


export class ApiError extends Error {
  status: number;
  validationErrors?: Record<string, string[]>;
  traceId?: string;

  constructor(data: ApiErrorResponse, status: number) {
    // Выбираем самое информативное сообщение для заголовка ошибки
    super(data.title || "Произошла ошибка при запросе к API");
    
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = data.errors;
  }

  /**
   * Удобный метод для получения всех текстов ошибок в один массив
   */
  getFlattenedErrors(): string[] {
    if (!this.validationErrors) return [];
    return Object.values(this.validationErrors).flat();
  }
}