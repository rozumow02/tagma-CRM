import type { DirectiveBinding, App } from "vue";

interface PermissionDirectiveBinding extends Omit<DirectiveBinding, "value"> {
  /** Joriy foydalanuvchining rol(lar)i — odatda `[isAdmin]`, ya'ni `[getUserData("ROLE")]`. */
  value: string[];
}

/**
 * `v-permission` direktivasi.
 *
 * Semantika (DIQQAT — nomlar an'anaviy emas):
 *  - `ALLOWED_ROLES` — elementni ko'rishga ruxsat etilgan rollar. Hozircha faqat `admin`.
 *  - `binding.value` — call-site'da JORIY foydalanuvchining roli uzatiladi (`[isAdmin]`).
 *  - Element faqat foydalanuvchi roli `ALLOWED_ROLES` ichida bo'lsa ko'rinadi
 *    (amalda: faqat admin uchun); aks holda DOM'dan butunlay olib tashlanadi.
 *
 * Cheklovlar: faqat `mounted`da ishlaydi (reaktiv emas — rol mid-session
 * o'zgarsa qayta baholanmaydi), va faqat admin / admin-emas farqini qila oladi.
 * Ko'p rolli to'liq tizim kerak bo'lsa, bu direktivani composable bilan
 * qayta yozish lozim (CLAUDE.md — "Future work"ga qarang).
 */
const ALLOWED_ROLES: string[] = ["admin"];

export const permissionDirective = {
  mounted(el: HTMLElement, binding: PermissionDirectiveBinding): void {
    const currentRoles: string[] = binding.value || [];
    const hasPermission = currentRoles.some((role) =>
      ALLOWED_ROLES.includes(role),
    );

    if (!hasPermission && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  },
};

export function registerPermissionDirective(app: App): void {
  app.directive("permission", permissionDirective);
}
