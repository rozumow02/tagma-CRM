import { nextTick } from "vue";
import i18n from "./index";

type Locale = "tm" | "ru";

const Trans = {
  supportedLocales: ["tm", "ru"] as Locale[],

  defaultLocale: "ru" as Locale,

  set currentLocale(newLocale: Locale) {
    i18n.global.locale.value = newLocale;
  },

  get currentLocale(): Locale {
    return i18n.global.locale.value as Locale;
  },

  isLocaleSupported(locale: any): boolean {
    return Trans.supportedLocales.includes(locale);
  },

  async switchLanguage(newLocale: Locale) {
    await Trans.loadLocaleMessages(newLocale);
    Trans.currentLocale = newLocale;
    document.querySelector("html")?.setAttribute("lang", newLocale);
    localStorage.setItem("user-locale", newLocale);
  },

  async loadLocaleMessages(locale: Locale) {
    if (!i18n.global.availableLocales.includes(locale)) {
      const messages = await import(`@/i18n/locales/${locale}.json`);
      i18n.global.setLocaleMessage(locale, messages.default);
    }
    return nextTick();
  },

  getPersistedLocale(): Locale | null {
    const persistedLocale = localStorage.getItem(
      "user-locale",
    ) as Locale | null;

    if (persistedLocale && Trans.isLocaleSupported(persistedLocale)) {
      return persistedLocale;
    }
    return "ru";
  },

  getUserLocale(): { locale: string; localNoRegion: string } {
    const locale = window.navigator.language || Trans.defaultLocale;

    return {
      locale: locale,
      localNoRegion: locale.split("-")[0],
    };
  },

  guessDefaultLocale(): Locale {
    const userPersistedLocale = Trans.getPersistedLocale();

    if (userPersistedLocale) {
      return userPersistedLocale;
    }

    const userPreferredLocale = Trans.getUserLocale();

    if (Trans.isLocaleSupported(userPreferredLocale.locale as Locale)) {
      return userPreferredLocale.locale as Locale;
    }
    if (Trans.isLocaleSupported(userPreferredLocale.localNoRegion as Locale)) {
      return userPreferredLocale.localNoRegion as Locale;
    }
    return Trans.defaultLocale;
  },

  async routeMiddleware(to: any, _from: any, next: any) {
    const paramLocale = to.params.locale;
    if (!Trans.isLocaleSupported(paramLocale)) {
      return next();
    }

    await Trans.switchLanguage(paramLocale);
    return next();
  },

  i18nRoute(to: any) {
    return {
      ...to,
      params: {
        locale: Trans.currentLocale,
        ...to.params,
      },
      query: {
        ...to.query,
      },
    };
  },
  t(text: string) {
    return i18n.global.t(text);
  },
};

export default Trans;
