export interface IManual {
  id: number;
  content_ru: string;
  content_tm: string;
  title_ru: string;
  title_tm: string;
  created_at: string;
  images: null | IManualImages[];
}
interface IManualImages {
  id: number;
  manual?: IManual;
  manual_id: number;
  name: string;
}

export interface IFormManual {
  content_ru: string;
  content_tm: string;
  title_ru: string;
  title_tm: string;
}
