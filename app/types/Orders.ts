import { Service } from "./Service";
import { JWTPayload } from "jose";

export type ServicesOrderParams = {
    email: string;
    airbnb_code: string;
    days_count: number;
    visitors_count: number;
    services_ids: number[];
}

export type Payments = JWTPayload & {
  payments: Payment[];
}

export type Payment = {
  id: number | string;
  email: string;
  client_number?: number | string;
  days_nubmer?: number | string;
  total_price?: number | string;
  reserve_id?: string;
  created_at?: string;
  updated_at?: string;
  session_id?: string;
  services?: Service[];
};