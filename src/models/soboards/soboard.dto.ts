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