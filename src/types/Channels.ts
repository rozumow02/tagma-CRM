export type IChannels = {
  name_ru: string;
  name_tm: string;
  status?: boolean;
  id?: number;
};

export type IChannelsForm = {
  name_ru: string;
  name_tm: string;
  status?: boolean;
};

export type IChannelsFormGroup = {
  management_id: number;
  size_id: number;
  status: boolean;
  structure_id: number;
  type_id: number;
};

export type IChannelsGroup = {
  id: number;
  management: string;
  management_id: number;
  size: string;
  size_id: number;
  status: boolean;
  structure: string;
  structure_id: number;
  type: string;
  type_id: number;
  updated_at: string;
};
