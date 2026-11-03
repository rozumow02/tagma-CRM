import type {
  IAllProduct,
  IPlanMain,
  ISelectAll,
  IPromotions,
  IPromotionsForm,
  IPoints,
  IFurniturePointCount,
} from "@/types";

export const agents = [
  { id: 81001, name: "Agent Demo 01" },
  { id: 81002, name: "Agent Demo 02" },
] satisfies ISelectAll[];

export const products = [
  {
    Id: 91001,
    code: "DEMO-ALPHA-01",
    name: "Demo Group Alpha",
    product_type_name: "Product Alpha",
    taste: "Variant 01",
    volume: 1,
    group_id: 92001,
  },
  {
    Id: 91002,
    code: "DEMO-ALPHA-02",
    name: "Demo Group Alpha",
    product_type_name: "Product Alpha",
    taste: "Variant 02",
    volume: 1,
    group_id: 92001,
  },
  {
    Id: 91003,
    code: "DEMO-BETA-01",
    name: "Demo Group Beta",
    product_type_name: "Product Beta",
    taste: "Variant 01",
    volume: 0.5,
    group_id: 92002,
  },
  {
    Id: 91004,
    code: "DEMO-BETA-02",
    name: "Demo Group Beta",
    product_type_name: "Product Beta",
    taste: "Variant 02",
    volume: 0.5,
    group_id: 92002,
  },
] satisfies IAllProduct[];

export const outlets: ISelectAll[] = Array.from({ length: 6 }, (_, index) => ({
  id: 83001 + index,
  name: `Demo Market ${String(index + 1).padStart(2, "0")}`,
}));

export const weekdays: ISelectAll[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((name, index) => ({ id: index + 1, name }));

export function sales(agentId: number | null): IPlanMain[] {
  const selected =
    agentId === null ? agents : agents.filter((agent) => agent.id === agentId);
  return products.map((product, index) => {
    const plan = selected.reduce(
      (total, agent) => total + 180 + index * 30 + (agent.id - 81001) * 20,
      0,
    );
    const forecast = selected.reduce(
      (total, agent) => total + 165 + index * 42 + (agent.id - 81001) * 25,
      0,
    );
    return {
      product_id: product.Id,
      product: `${product.product_type_name} — ${product.taste}`,
      group_id: product.group_id,
      name: product.name,
      product_type: product.product_type_name,
      volume: product.volume,
      plan,
      forecast,
      forecast_vs_plan: (forecast / plan - 1) * 100,
      data: Array.from({ length: 7 }, (_, day) => day + 1)
        .filter(
          (day) => !(index === 1 && day === 3) && !(index === 3 && day === 5),
        )
        .map((day) => ({
          day,
          count: selected.reduce(
            (total, agent) =>
              total + 8 + index * 3 + day * 2 + (agent.id - 81001) * 4,
            0,
          ),
        })),
    };
  });
}

const promotionRows: IPromotions[] = [
  {
    id: 84001,
    name_ru: "Demo Promotion 01",
    name_tm: "Demo Promotion 01",
    start: "01.01.2030",
    end: "31.12.2030",
    created_at: "01.01.2030",
    count: 3,
    status: true,
    list: [91001, 91002],
  },
];

export function promotions(name: string, page: number, size: number) {
  const filtered = promotionRows.filter((row) =>
    `${row.name_ru} ${row.name_tm}`.toLowerCase().includes(name.toLowerCase()),
  );
  return {
    items: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
    pageCount: Math.ceil(filtered.length / size),
  };
}

function displayDate(value: string): string {
  return new Date(value)
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join(".");
}

export function createPromotion(form: IPromotionsForm): void {
  promotionRows.unshift({
    ...form,
    id: 84001 + promotionRows.length,
    start: displayDate(form.start),
    end: displayDate(form.end),
    created_at: "01.01.2030",
    status: true,
    list: [...form.list],
  });
}

const routeRows = new Map<string, ISelectAll[]>();
export function routeOrder(agentId: number, dayId: number): ISelectAll[] {
  const key = `${agentId}:${dayId}`;
  if (!routeRows.has(key)) {
    const offset = (agentId - 81001 + dayId - 1) % outlets.length;
    routeRows.set(key, [...outlets.slice(offset), ...outlets.slice(0, offset)]);
  }
  return routeRows.get(key)!;
}

export function saveRouteOrder(
  agentId: number,
  dayId: number,
  rows: ISelectAll[],
): void {
  routeRows.set(
    `${agentId}:${dayId}`,
    rows.map((row) => ({ ...row })),
  );
}

export const outletCities = [
  { id: 86001, name: "Demo City Alpha" },
  { id: 86002, name: "Demo City Beta" },
] satisfies ISelectAll[];

export const outletDistricts = [
  { id: 87001, cityId: 86001, name: "Demo District A1" },
  { id: 87002, cityId: 86001, name: "Demo District A2" },
  { id: 87003, cityId: 86002, name: "Demo District B1" },
  { id: 87004, cityId: 86002, name: "Demo District B2" },
] satisfies (ISelectAll & { cityId: number })[];

// These satisfy eager boot requests for controls excluded from the read-only UI.
export const emptyOutletLookup: ISelectAll[] = [];

type DemoOutlet = IPoints & { furniture_list: IFurniturePointCount[] };
const equipmentNames = ["Demo Display", "Demo Rack"];
const outletNames = [
  "Central Demo Market",
  "Riverside Demo Store",
  "North Point Demo Shop",
  "City Center Demo Market",
  "West District Demo Store",
  "East Point Demo Shop",
  "Green Avenue Demo Market",
  "Metro Demo Store",
  "Sunrise Demo Shop",
  "Parkside Demo Market",
  "South Gate Demo Store",
  "Harbor Demo Shop",
];

// Independent of the six-outlet Route Ordering fixture and its save validation.
const outletRows: DemoOutlet[] = outletNames.map((name, index) => {
  const city = outletCities[Math.floor(index / 6)];
  const district = outletDistricts[Math.floor(index / 3)];
  const agent = agents[index % agents.length];
  const day = weekdays[index % weekdays.length];
  const category = `Demo Category ${index % 2 === 0 ? "Alpha" : "Beta"}`;
  return {
    id: 88001 + index,
    name,
    code: `DEMO-POINT-${String(index + 1).padStart(3, "0")}`,
    city_id: city.id,
    city: city.name,
    district_id: district.id,
    district: district.name,
    location: `Demo Zone ${String(index + 1).padStart(2, "0")}`,
    orientir: `Demo Landmark ${String(index + 1).padStart(2, "0")}`,
    status: index % 4 !== 3,
    tradCategory: category,
    trade_category: category,
    tradeCategoryId: 89001 + (index % 2),
    trade_category_id: 89001 + (index % 2),
    trade_agent_id: agent.id,
    trade_agent: agent.name,
    trade_channel_id: 90001 + (index % 2),
    trade_channel: `Demo Channel ${index % 2 === 0 ? "Alpha" : "Beta"}`,
    day_id: day.id,
    day: day.name,
    ekspeditor_id: 85001 + (index % 2),
    ekspeditor: `Delivery Demo ${(index % 2) + 1}`,
    updated_at: `0${(index % 7) + 1}.01.2030`,
    debt: index % 3 === 0 ? 0 : (index + 1) * 125,
    furniture_list:
      index % 4 === 0
        ? []
        : equipmentNames.map((equipment, item) => ({
            name: equipment,
            count: ((index + item) % 3) + 1,
          })),
  };
});

export interface OutletQuery {
  name: string;
  agentId?: number;
  cityId?: number;
  districtId?: number;
  pageNumber: number;
  pageSize: number;
}

export function outletList(query: OutletQuery) {
  const filtered = outletRows.filter(
    (row) =>
      row.name.toLowerCase().includes(query.name.toLowerCase()) &&
      (query.agentId === undefined || row.trade_agent_id === query.agentId) &&
      (query.cityId === undefined || row.city_id === query.cityId) &&
      (query.districtId === undefined || row.district_id === query.districtId),
  );
  return {
    items: filtered.slice(
      (query.pageNumber - 1) * query.pageSize,
      query.pageNumber * query.pageSize,
    ),
    total: filtered.length,
    pageCount: Math.ceil(filtered.length / query.pageSize),
    // Keep entries at zero for empty results; the existing store ignores [].
    furniture_list: equipmentNames.map((name) => ({
      name,
      count: filtered.reduce(
        (total, row) =>
          total +
          (row.furniture_list.find((item) => item.name === name)?.count ?? 0),
        0,
      ),
    })),
  };
}
