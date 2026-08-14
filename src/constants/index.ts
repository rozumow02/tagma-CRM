import Trans from "@/i18n/translation";
import type { IBaseUser, IORDERSTATUS } from "@/types";

export const TYPE: ITRADE_CHANNELS = "type";
export const MAGNITUDE: ITRADE_CHANNELS = "size";
export const CONTROL: ITRADE_CHANNELS = "management";
export const STRUCTURE: ITRADE_CHANNELS = "structure";

export const TRADE_CHANNELS: ITRADE_CHANNELS[] = [
  TYPE,
  MAGNITUDE,
  CONTROL,
  STRUCTURE,
];

export type ITRADE_CHANNELS = "type" | "management" | "size" | "structure";

export const DISCOUNT_TYPES = [
  { name: Trans.t("tip_1"), id: true },
  { name: Trans.t("tip_2"), id: false },
];

export const USER_TYPES: IBaseUser[] = [
  {
    id: "admin",
    name: Trans.t("admin"),
  },
  {
    id: "viewer",
    name: Trans.t("viewer"),
  },
  {
    id: "agent",
    name: Trans.t("points.trade_agent"),
  },
  {
    id: "ekspeditor",
    name: Trans.t("ekspeditor"),
  },
  {
    id: "merchandiser",
    name: Trans.t("merchandiser"),
  },
];
// Filtering
export const FILTERS_SLUG = ["distribution", "display", "soldOut"];

export const ORDER_STATUS: IORDERSTATUS[] = [
  {
    id: -1,
    name: Trans.t("personal_dolg"),
    color: "danger",
  },
  {
    id: 0,
    name: Trans.t("not_closed"),
    color: "primary",
  },
  {
    id: 1,
    name: Trans.t("closed"),
    color: "primary",
  },
] as const;
