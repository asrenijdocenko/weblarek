
import { Cart } from './components/Models/Cart';
import { ProductList } from './components/Models/ProductList';
import { Buyer } from './components/Models/Buyer';
import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ApiClient } from './components/base/ApiClient';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants'; 
import { IOrderData } from './types';


console.log('---------------Проверка методов модели ProductList---------------');
// Проверка методов ProductList
const productsModel = new ProductList();
productsModel.saveItems(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getItems());
productsModel.getItem(    productsModel.getItems()[0].id);
console.log('Полученный товар по id: ', productsModel.getItem(productsModel.getItems()[0].id));
productsModel.savePreviewItem(productsModel.getItems()[0]);
console.log('Предпросмотр товара: ', productsModel.getPreviewItem());

console.log('---------------Проверка методов Cart---------------');
// Проверка методов Cart
const cartModel = new Cart();
cartModel.addItem(productsModel.getItems()[0]);
console.log('Товары в корзине: ', cartModel.getItems());
cartModel.removeItem(productsModel.getItems()[0]);
console.log('Товары в корзине после удаления: ', cartModel.getItems());
cartModel.addItem(productsModel.getItems()[1]);
console.log('Общая стоимость товаров в корзине: ', cartModel.getTotalPrice());
console.log('Общее количество товаров в корзине: ', cartModel.getTotalCount());
console.log('Проверка наличия товара в корзине по id: ', cartModel.checkItemInCart(productsModel.getItems()[1].id));
cartModel.clearCart();
console.log('Товары в корзине после очистки: ', cartModel.getItems());


console.log('---------------Проверка методов Buyer---------------');
// Проверка методов Buyer
const buyerModel = new Buyer();
buyerModel.saveData({
    payment: 'online',
    address: 'Test Address',
    email: 'test@test.ru',
    phone: '+79999999999'
});

const emptyBuer = new Buyer;
buyerModel.saveData({
    payment: '',
    address: '',
    email: '',
    phone: ''
});

if(buyerModel.getData()) console.log('данные покупателя получены, ', buyerModel.getData());
else console.log('ошибка получения данных:', buyerModel.validateByerInfo());

buyerModel.clearData();
console.log('Данные покупателя после очистки: ', buyerModel.getData());

console.log('Ошибки при валидации:', emptyBuer.validateByerInfo());

    


console.log('---------------Проверка методов ApiClient---------------');
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
    
    apiClient.createOrder(testOrder)
        .then(result => console.log('Результат заказа:', result))
