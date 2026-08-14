export interface IDistricts {
  city: string;
  city_id: number;
  id: number;
  name_ru: string;
  name_tm: string;
  status: boolean;
  updated_at: string;
}

export interface IDistrictForm {
  city_id: number | null;
  name_ru: string;
  name_tm: string;
}
