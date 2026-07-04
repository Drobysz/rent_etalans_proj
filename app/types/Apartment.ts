import type { Image } from "./Service";

export type Apartment = {
    id: number;
    name: string;
    price: number;
    description: string;
    nb_beds: number;
    nb_chambers: number;
    apart_link: string;
    images?: Image[];
};
