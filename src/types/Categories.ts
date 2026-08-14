export interface ICategories {
  id: number;
  max_sum: number;
  min_sum: number;
  name_ru: string;
  name_tm: string;
  status: boolean;
}

export interface ICategoriesForm {
  max_sum: number;
  min_sum: number;
  name: string;
  // name_tm: string;
  status: boolean;
}
