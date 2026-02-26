export interface IResult {
  success: boolean;
  message: string;
  data?: any;
  count?: bigint | number;
}