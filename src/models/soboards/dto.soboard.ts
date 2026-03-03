export interface ISoBoard {
  soboard_id: number;
  cago: string;
  status: number;
  writer: string;
  subject: string;
  contents: string | null;
  contents_count: number;
  hits: number;
  created_at: Date;
  updated_at: Date;
  user_id: number;
}

export interface ISoBoardContent {
  content_id: number;
  sort: number;
  contents: string;
  is_use: boolean;
  created_at: Date;
  soboard_id: number;
}

export interface ISoBoardFavorite {
  favorite_id: number;
  is_use: boolean;
  created_at: Date;
  user_id: number;
  soboard_id: number;
}

export interface ISoBoardFile {
  file_id: number;
  sort: number;
  file_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  soboard_id: number;
}

export interface ISoBoardHit {
  hits_id: number;
  created_at: Date;
  user_id: number;
  soboard_id: number;
}

export interface ISoBoardImage {
  image_id: number;
  sort: number;
  image_name: string;
  origin_name: string;
  is_use: boolean;
  created_at: Date;
  soboard_id: number;
  content_id: number;
}