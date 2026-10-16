"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useUpdateQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = (key: string, value: string | string[] | null) => {
    // Копія Url Params
    const params = new URLSearchParams(searchParams.toString());

    if (
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      // Якщо нічого не передали то видаляємо
      params.delete(key);
    } else if (Array.isArray(value)) {
      // Якщо масив з'єднати через кому
      params.set(key, value.join(","));
    } else {
      // Записати
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return updateQuery;
}
