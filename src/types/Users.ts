export interface IUsers {
  id: number;
  type: IUserType;
  name_ru: string;
  name_tm: string;
  username: string;
  created_at: string;
  status: boolean;
  ekspeditor_id: number;
  agent_id: number;
  merchandiser_id: number;
}

export interface IFormUsers {
  agent_id: number | null;
  confirm_password: string;
  ekspeditor_id: number | null;
  merchandiser_id: number | null;
  id: number | null;
  name_ru: string;
  name_tm: string;
  password: string;
  type: IUserType | null;
  username: string;
}

export interface IPasswordUsers {
  confirm_password: string;
  password: string;
  user_id: number;
}

export type IUserType =
  | "viewer"
  | "admin"
  | "ekspeditor"
  | "agent"
  | "merchandiser";

export interface IBaseUser {
  id: IUserType;
  name: string;
}
