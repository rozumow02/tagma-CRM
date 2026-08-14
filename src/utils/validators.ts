// utils/validators.ts

/**
 * Validate username.
 * Rules:
 * - Only English letters (A-Z, a-z)
 * - Numbers (0-9)
 * - Space and dot allowed
 * - No other special characters
 */
export const isValidUsername = (value: string): boolean => {
  if (!value) return false;
  const pattern = /^[A-Za-z0-9 .]+$/;
  return pattern.test(value);
};
