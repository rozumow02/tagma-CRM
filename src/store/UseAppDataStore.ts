// src/composables/useUserData.ts
import { STORAGE_KEYS, type StorageKeys } from "@/constants/storageKeys";

/**
 * User ma'lumotlarini boshqarish uchun composable
 */
export function useUserData() {
  /**
   * LocalStorage'dan userData olish
   * @param key - STORAGE_KEYS dan kalit
   * @returns - saqlangan qiymat
   */
  const getUserData = (key: StorageKeys): string => {
    return localStorage.getItem(STORAGE_KEYS[key]) || "";
  };

  /**
   * User ma'lumotlarini localStorage'ga saqlash
   * @param key - STORAGE_KEYS dan kalit
   * @param value - saqlanadigan qiymat
   */
  const setUserData = (key: StorageKeys, value: string | null): void => {
    if (value) {
      localStorage.setItem(STORAGE_KEYS[key], value); // Saqlash
    } else {
      localStorage.removeItem(STORAGE_KEYS[key]); // O'chirish
    }
  };

  /**
   * User ma'lumotlarini tozalash
   */
  const clearUserData = (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key); // Hammasini o'chirish
    });
  };

  return {
    getUserData,
    setUserData,
    clearUserData,
  };
}
