
import { Cart } from './components/Models/Cart';
import { ProductList } from './components/Models/ProductList';
import { Buyer } from './components/Models/Buyer';
import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ApiClient } from './components/base/ApiClient';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants'; 
import { IProductsResponse as ProductResponse, IOrderData } from './types';



// Проверка методов ProductList
const ProductsModel = new ProductList();
ProductsModel.saveItems(apiProducts.items);
console.log('Массив товаров из каталога: ', ProductsModel.getItems());
ProductsModel.getItem(ProductsModel.getItems()[0].id);
console.log('Полученный товар по id: ', ProductsModel.getItem(ProductsModel.getItems()[0].id));
ProductsModel.savePreviewItem(ProductsModel.getItems()[0]);
console.log('Предпросмотр товара: ', ProductsModel.getPreviewItem());


// Проверка методов Cart
const CartModel = new Cart();
CartModel.addItem(ProductsModel.getItems()[0]);
console.log('Товары в корзине: ', CartModel.getItems());
CartModel.removeItem(ProductsModel.getItems()[0]);
console.log('Товары в корзине после удаления: ', CartModel.getItems());
CartModel.addItem(ProductsModel.getItems()[1]);
console.log('Общая стоимость товаров в корзине: ', CartModel.getTotalPrice());
console.log('Общее количество товаров в корзине: ', CartModel.getTotalCount());
console.log('Проверка наличия товара в корзине по id: ', CartModel.checkItemInCart(ProductsModel.getItems()[1].id));
CartModel.clearCart();
console.log('Товары в корзине после очистки: ', CartModel.getItems());



const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Тест getProductList
 apiClient.getProductList()
    .then(products => {
        console.log('Товары получены:', products.total);
        const productsFromApi: ProductList = new ProductList();
        productsFromApi.saveItems(products.items);
        console.log('Товары сохранены в модели ProductList:', productsFromApi.getItems());
        
    })
    .catch(error => console.error('Ошибка getProductList:', error));

// Тест createOrder
const testOrder: IOrderData = {
    payment: 'online' as const,
    email: 'test@test.ru',
    phone: '+79998887766',
    address: 'Тестовый адрес',
    total: 1450,
    items: ['c101ab44-ed99-4a54-990d-47aa2bb4e7d9']
};


const validationErrors = new Buyer().validateOrderData(testOrder);

if (validationErrors.length > 0) {

    console.error('Ошибки валидации:');
    validationErrors.forEach(error => console.error(error));

} else {
    
    apiClient.createOrder(testOrder)
        .then(result => console.log('Результат заказа:', result))
        .catch(error => console.error('Ошибка createOrder:', error));
}
