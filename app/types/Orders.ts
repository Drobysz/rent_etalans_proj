import { Service } from "./Service";

export type ServicesOrderParams = {
    email: string;
    airbnb_code: string;
    days_count: number;
    visitors_count: number;
    services_ids: number[];
}

export type Payment = {
  id: number | string;
  email: string;
  client_number?: number | string;
  total_price?: number | string;
  reserve_id?: string;
  created_at?: string;
  services?: Service[];
};