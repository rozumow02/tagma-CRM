import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import type { IPromotionsForm, ISelectAll } from "@/types";
import {
  agents,
  products,
  outlets,
  weekdays,
  sales,
  promotions,
  createPromotion,
  routeOrder,
  saveRouteOrder,
} from "./data";

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function integer(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (value === "") return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}
function body(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}
function promotionForm(value: unknown): value is IPromotionsForm {
  if (!record(value)) return false;
  return (
    typeof value.name_ru === "string" &&
    Boolean(value.name_ru.trim()) &&
    typeof value.name_tm === "string" &&
    Boolean(value.name_tm.trim()) &&
    typeof value.count === "number" &&
    Number.isFinite(value.count) &&
    value.count > 0 &&
    typeof value.start === "string" &&
    Number.isFinite(Date.parse(value.start)) &&
    typeof value.end === "string" &&
    Number.isFinite(Date.parse(value.end)) &&
    Date.parse(value.start) <= Date.parse(value.end) &&
    Array.isArray(value.list) &&
    value.list.length > 0 &&
    value.list.every((id: unknown) =>
      products.some((product) => product.Id === id),
    )
  );
}
function outletOrder(value: unknown): value is ISelectAll[] {
  return (
    Array.isArray(value) &&
    value.length === outlets.length &&
    value.every(
      (row: unknown) =>
        record(row) &&
        outlets.some(
          (outlet) => outlet.id === row.id && outlet.name === row.name,
        ),
    ) &&
    new Set(value.map((row: ISelectAll) => row.id)).size === outlets.length
  );
}
function fail(
  config: InternalAxiosRequestConfig,
  status: number,
  message: string,
): never {
  throw new AxiosError(message, "ERR_DEMO_REQUEST", config, undefined, {
    config,
    status,
    statusText: "Portfolio demo",
    headers: new AxiosHeaders(),
    data: { message },
  });
}

export const demoAdapter: AxiosAdapter = async (config) => {
  // Never delegate to an HTTP/XHR/fetch adapter, including for absolute URLs.
  config.headers.delete("Authorization");
  config.baseURL = undefined;
  const url = config.url ?? "";
  if (!/^[a-z][a-z0-9/-]*$/i.test(url))
    fail(config, 501, "Unavailable in portfolio demo");
  const method = (config.method ?? "get").toUpperCase();
  const params: unknown = config.params;
  const query = record(params) ? params : {};
  const payload = body(config.data as unknown);
  let data: unknown;
  switch (`${method} ${url}`) {
    case "GET points/agents":
      data = agents;
      break;
    case "GET routes/days":
      data = weekdays;
      break;
    case "GET orders/products":
      data = products;
      break;
    case "GET plans/main": {
      const agent =
        query.agent_id == null || query.agent_id === ""
          ? null
          : integer(query.agent_id);
      if (
        (query.agent_id != null && query.agent_id !== "" && agent === null) ||
        (agent !== null && !agents.some((row) => row.id === agent))
      )
        fail(config, 400, "Invalid demo agent");
      const month = integer(query.month),
        year = integer(query.year);
      if (
        month === null ||
        month < 1 ||
        month > 12 ||
        year === null ||
        year < 1 ||
        year > 9999
      )
        fail(config, 400, "Invalid demo period");
      data = sales(agent);
      break;
    }
    case "GET promotions": {
      const page = integer(query.pageNumber ?? 1),
        size = integer(query.pageSize ?? 10);
      if (
        page === null ||
        page < 1 ||
        size === null ||
        size < 1 ||
        size > 1000 ||
        (query.name != null && typeof query.name !== "string")
      )
        fail(config, 400, "Invalid demo pagination");
      data = promotions(
        typeof query.name === "string" ? query.name : "",
        page,
        size,
      );
      break;
    }
    case "POST promotions":
      if (!promotionForm(payload)) fail(config, 400, "Invalid demo promotion");
      createPromotion(payload);
      data = { saved: true };
      break;
    case "GET routes/orders/get":
    case "POST routes/orders/post": {
      const agent = integer(query.agentId),
        day = integer(query.dayId);
      if (
        agent === null ||
        !agents.some((row) => row.id === agent) ||
        day === null ||
        day < 1 ||
        day > 7
      )
        fail(config, 400, "Invalid demo route selection");
      if (method === "POST") {
        if (!outletOrder(payload))
          fail(config, 400, "Invalid demo outlet order");
        saveRouteOrder(agent, day, payload);
        data = { saved: true };
      } else data = routeOrder(agent, day);
      break;
    }
    default:
      fail(config, 501, "Unavailable in portfolio demo");
  }
  return {
    data: structuredClone(data),
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config,
  };
};
