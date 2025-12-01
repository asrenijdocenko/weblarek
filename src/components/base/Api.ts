type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T extends object>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}


// ApiClient.ts
import { 
    IApi, 
    IProduct, 
    IProductsResponse,
    IOrderData, 
    IOrderSuccessResponse,
    IOrderErrorResponse,
    TOrderResult 
} from '../../types';

export class ApiClient {
    private _api: IApi;
    private _baseUrl: string;

    constructor(api: IApi, baseUrl: string = '') {
        this._api = api;
        this._baseUrl = baseUrl;
    }

    
    async getProductList(): Promise<IProductsResponse> {
        try {
            const uri = `${this._baseUrl}/product/`;
            const response = await this._api.get(uri);
            
            const data = response as IProductsResponse;
            
            return data;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw error;
        }
    }

    async createOrder(orderData: IOrderData): Promise<TOrderResult> {
        try {
            const uri = `${this._baseUrl}/order/`;
            const response = await this._api.post(uri, orderData);
            
            const result = response as IOrderSuccessResponse | IOrderErrorResponse;
            
            return result as IOrderSuccessResponse;
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            throw error;
        }
    }


    validateOrderData(orderData: IOrderData): string[] {
        const errors: string[] = [];
        
        if (!orderData.payment || (orderData.payment !== 'online' && orderData.payment !== 'offline')) {
            errors.push('Не выбран способ оплаты или выбран неверный способ');
        }
        
        if (!orderData.email || !orderData.email.includes('@')) {
            errors.push('Неверный email');
        }
        
        if (!orderData.phone || orderData.phone.trim().length < 5) {
            errors.push('Неверный телефон');
        }
        
        if (!orderData.address || orderData.address.trim().length === 0) {
            errors.push('Не указан адрес');
        }
        
        if (!orderData.total || orderData.total <= 0) {
            errors.push('Неверная сумма заказа');
        }
        
        if (!orderData.items || orderData.items.length === 0) {
            errors.push('Корзина пуста');
        }
        
        return errors;
    }
}