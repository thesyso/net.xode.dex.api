export interface IResult {
  success: boolean;
  message: string;
  data?: any;
  count?: bigint | number;
}

export interface IResultRefresh {
  ok: boolean;
  message: string;
  uid?: number;
}