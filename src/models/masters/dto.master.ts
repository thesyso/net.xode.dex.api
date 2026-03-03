export interface IMaster {
  master_uid: number;
  status: number;
  authority: number;
  emailid: string;
  password: string | null;
  salt: string;
  email: string;
  mastername: string | null;
  nickname: string;
  nation_no: string | null;
  phone: string | null;
  nation: string | null;
  location: string | null;
  language: string | null;
  address: string | null;
  address_detail: string | null;
  zipcode: string | null;
  connected_ip: string | null;
  connected_at: Date | null;
  created_at: Date;
  updated_at: Date;
}