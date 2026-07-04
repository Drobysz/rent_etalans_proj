import { Service } from "./Service";
import { Apartment } from "./Apartment";
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
  days_number?: number | string;
  days_count?: number | string;
  reservation_id?: number | string | null;
  reservation_code?: string | null;
  apart_id?: number | string | null;
  checkin?: string | null;
  checkout?: string | null;
  total_price?: number | string;
  reserve_id?: string;
  created_at?: string;
  updated_at?: string;
  session_id?: string;
  services?: Service[];
  apartment?: Apartment | null;
  reservation?: {
    id: number | string;
    reservation_code?: string | null;
    checkin?: string | null;
    checkout?: string | null;
    days_count?: number | string;
    rooms_count?: number | string;
    guests?: number | string;
    status?: string;
    apartment?: Apartment | null;
  } | null;
};
