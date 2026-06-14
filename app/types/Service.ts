export type Image = {
    id: number;
    filename: string;
    path: string;
    url: string;
};

export type ServiceDescriptionLocale = "en" | "fr" | "de";

export type ServiceDescription = {
    locale: ServiceDescriptionLocale;
    description: string;
};

export type Service = {
    id: number;
    name: string;
    description: string;
    descriptions?: ServiceDescription[];
    visible: boolean;
    fixed_price: boolean;
    price: number;
    images: Image[];
};
