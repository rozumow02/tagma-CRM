// src/constants/storageKeys.ts

export const STORAGE_KEYS = {
  TOKEN: "user_token",
  ROLE: "user_role",
  // Kerakli boshqa kalitlar
} as const;

export type StorageKeys = keyof typeof STORAGE_KEYS;
