export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
}

export type TPayment = 'online' | 'offline' | '';

export interface IBuyer {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}


export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export type TPaymentMethod = 'online' | 'offline'; 

export interface IOrderData {
    payment: TPaymentMethod; 
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; 
}

export interface IOrderSuccessResponse {
    id: string;
    total: number;
}



export type TOrderResult = IOrderSuccessResponse;

export type TError = { [key in keyof IBuyer]?: string };


// слой View

export type HeaderData = {
    counter: number;
}