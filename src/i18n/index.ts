import { createI18n } from "vue-i18n";
import tm from "./locales/tm.json";
import ru from "./locales/ru.json";

export default createI18n({
  locale: "ru",
  legacy: false,
  fallbackLocale: "ru",
  globalInjection: true,
  messages: { tm, ru },
});
