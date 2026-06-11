export type Image = {
    id: number;
    filename: string;
    path: string;
    url: string;
};

export type Service = {
    id: number;
    name: string;
    description: string;
    visible: boolean;
    fixed_price: boolean;
    price: number;
    images: Image[];
};