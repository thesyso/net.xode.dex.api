export interface IBoard {
  board_id: number;
  cago: string;
  depth: number;
  writer: string;
  subject: string;
  contents: string | null;
  hits: number;
  favorite: number;
  created_user_id: number;
  updated_user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IBoardFavorite {
  favorite_id: number;
  is_use: boolean;
  created_at: Date;
  user_id: number;
  board_id: number;
}

export interface IBoardFile {
  file_id: number;
  sort: number;
  file_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  board_id: number;
}

export interface IBoardImage {
  image_id: number;
  sort: number;
  image_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  board_id: number;
}