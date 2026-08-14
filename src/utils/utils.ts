export function resetObject<T extends object>(obj: T) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T];

    if (typeof value === "string") {
      obj[key as keyof T] = "" as T[keyof T];
    } else if (typeof value === "number") {
      obj[key as keyof T] = null as T[keyof T];
    } else if (Array.isArray(value)) {
      obj[key as keyof T] = [] as T[keyof T];
    } else if (typeof value === "boolean") {
      obj[key as keyof T] = true as T[keyof T];
    } else {
      obj[key as keyof T] = null as T[keyof T];
    }
  });
}
// Dinamik filtrlash
export function uniqueByField<T>(items: T[], field: keyof T): T[] {
  const seen = new Set<any>(); // Ko'rilgan `field` qiymatlarini saqlash
  return items.filter((item) => {
    const value = item[field]; // `field` qiymatini olish
    if (!seen.has(value)) {
      seen.add(value);
      return true; // Yangi qiymat bo'lsa, qabul qilinadi
    }
    return false; // Takrorlangan qiymat o'tkazib yuboriladi
  });
}
// Bitin bolegi ayratyn we galyndyny ayratyn beryar
export function splitPartNumber(value?: number): {
  integerPart: number;
  fractionalPart: number;
} {
  if (!value) return { fractionalPart: 0, integerPart: 0 };
  // Sonni stringga aylantirish va "." bo‘yicha bo‘lish
  const [integerPart, fractionalPart] = value.toString().split(".");
  const frac =
    fractionalPart?.length === 1
      ? parseInt(fractionalPart + "0", 10)
      : parseInt(fractionalPart, 10);

  return {
    integerPart: parseInt(integerPart, 10), // Butun qismni son ko'rinishida
    fractionalPart: frac ? frac : 0, // Kasr qism bo'lmasa, 0
  };
}

export function splitNumber(num: number): { whole: number; remainder: number } {
  const whole = Math.floor(num / 100); // Butun qism
  const remainder = num % 100; // Qoldiq qism
  return { whole, remainder };
}

// Date boleklap beryar day, month, year
export function getDateParts(dateString: string) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const day = date.getDate();
  const month = date.getMonth() + 1; // `getMonth()` 0-based bo'ladi
  const year = date.getFullYear();

  return { day, month, year };
}

// objecting ? bolgan undefined we null bolgan element delete edyar
export function removeOptionalFields<T extends object>(obj: T): T {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (
      result[key as keyof T] === null ||
      result[key as keyof T] === undefined
    ) {
      delete result[key as keyof T];
    }
  });
  return result;
}

// Sanlarni formatlovchi funksiya
export function formatNumber(num?: number): string {
  const value = typeof num === "number" && !isNaN(num) ? num : 0;
  // Always show two decimals, use space as thousands separator
  return value
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, " ");
}
export function formatNumberCount(num?: number): string {
  const value = typeof num === "number" && !isNaN(num) ? num : 0;
  // Always show two decimals, use space as thousands separator
  return value.toLocaleString("en-US").replace(/,/g, " ");
}
export function formatNumberCountFixed(
  num?: number,
  digits: number = 1,
): string {
  const value = typeof num === "number" && !isNaN(num) ? num : 0;
  return value
    .toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    .replace(/,/g, " ");
}

// hozirgi ayny we yylny return edip beryar
export function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // 0-based -> 1-based
    year: now.getFullYear(),
  };
}

export function getMonthName(
  monthNumber: string,
  locale: string = "ru",
): string {
  const date = new Date(2000, parseInt(monthNumber, 10) - 1, 1);
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
}

export function formatDate(dateString: string): string {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);

  // Elementlarni formatlash
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Oy 0 dan boshlanadi
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Yangi formatga o‘tkazish
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}
