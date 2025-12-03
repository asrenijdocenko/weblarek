import { 
    IApi, 
    IProductsResponse,
    IOrderData, 
    IOrderSuccessResponse,
    IOrderErrorResponse,
    TOrderResult 
} from '../../types';


export class ApiClient {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    async getProductList(): Promise<IProductsResponse> {
        try {
            const response = await this._api.get('/product/');
            return response as IProductsResponse;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw error;
        }
    }


    async createOrder(orderData: IOrderData): Promise<TOrderResult> {
        try {

            const response = await this._api.post('/order', orderData);
            
            const result = response as IOrderSuccessResponse | IOrderErrorResponse;
            
            if ('error' in result) {
                return result as IOrderErrorResponse;
            } else {
                return result as IOrderSuccessResponse;
            }
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            throw error;
        }
    }


}
