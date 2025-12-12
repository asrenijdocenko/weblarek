import { Galery } from './components/View/Galery';
import { Cart as CartModel } from './components/Models/Cart';
import { ProductList } from './components/Models/ProductList';
import { Buyer } from './components/Models/Buyer';
import { HeaderCartCounter } from './components/View/Header';
import { Modal } from './components/View/Modals/Modal';
import { ModalCardPreview } from './components/View/Modals/ModalCardPReview';
import { ModalCart } from './components/View/Modals/ModalCart';
import { ModalOrder } from './components/View/Modals/ModalOrder';
import { ModalContacts } from './components/View/Modals/ModalContacts';
import { ModalSuccess } from './components/View/Modals/ModalSuccsess';
import { IBuyer } from './types';

import './scss/styles.scss';
import { ApiClient } from './components/base/ApiClient';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
// Инициализация моделей данных
const productsModel = new ProductList();
const cartModel = new CartModel();
const buyerModel = new Buyer();

// Инициализация API клиента
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Инициализация компонентов View
const headerCounter = new HeaderCartCounter(document.querySelector('.header')!);
const gallery = new Galery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('#modal-container')!);

// Загрузка товаров с сервера
apiClient.getProductList()
    .then(products => {
        productsModel.saveItems(products.items);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });

// Обработка событий от моделей данных

// Изменение каталога товаров
productsModel.on('items:changed', () => {
    gallery.render({ catalog: productsModel.getItems() });
});

// Изменение выбранного товара для просмотра
productsModel.on('preview:changed', () => {
    const previewItem = productsModel.getPreviewItem();
    if (previewItem) {
        const isInCart = cartModel.checkItemInCart(previewItem.id);
        const previewContainer = document.createElement('div');
        const previewCard = new ModalCardPreview(previewContainer);
        previewCard.render({ product: previewItem, isInCart });
        modal.render({ content: previewCard.render() });
        modal.open();
    }
});

// Изменение содержимого корзины
cartModel.on('cart:changed', () => {
    headerCounter.render({ counter: cartModel.getTotalCount() });
});

// Изменение данных покупателя
buyerModel.on('buyer:changed', () => {
    // Обновление данных в формах при необходимости
});

// Обработка событий от компонентов представления

// Выбор карточки для просмотра
document.addEventListener('card:select', ((e: CustomEvent) => {
    const productId = e.detail.id;
    const product = productsModel.getItem(productId);
    if (product) {
        productsModel.savePreviewItem(product);
    }
}) as EventListener);

// Нажатие кнопки покупки товара
document.addEventListener('card:add', ((e: CustomEvent) => {
    const productId = e.detail.id;
    const product = productsModel.getItem(productId);
    if (product) {
        cartModel.addItem(product);
        modal.close();
    }
}) as EventListener);

// Нажатие кнопки удаления товара из корзины
document.addEventListener('card:remove', ((e: CustomEvent) => {
    const productId = e.detail.id;
    const product = productsModel.getItem(productId);
    if (product) {
        cartModel.removeItem(product);
        modal.close();
    }
}) as EventListener);

// Нажатие кнопки открытия корзины
document.addEventListener('header:cart:click', () => {
    const cartContainer = document.createElement('div');
    const cartView = new ModalCart(cartContainer);
    cartView.render({
        items: cartModel.getItems(),
        total: cartModel.getTotalPrice()
    });
    modal.render({ content: cartView.render() });
    modal.open();
});

// Нажатие кнопки удаления товара из корзины (в модальном окне корзины)
document.addEventListener('basket:remove', ((e: CustomEvent) => {
    const productId = e.detail.id;
    const product = productsModel.getItem(productId);
    if (product) {
        cartModel.removeItem(product);
        // Обновляем модальное окно корзины
        const cartContainer = document.querySelector('.modal__content')?.firstElementChild as HTMLElement;
        if (cartContainer) {
            const cartView = new ModalCart(cartContainer);
            cartView.render({
                items: cartModel.getItems(),
                total: cartModel.getTotalPrice()
            });
        }
    }
}) as EventListener);

// Нажатие кнопки оформления заказа
document.addEventListener('cart:order', () => {
    const orderContainer = document.createElement('div');
    const orderView = new ModalOrder(orderContainer);
    const buyerData = buyerModel.getData();
    orderView.render({
        payment: buyerData.payment,
        address: buyerData.address
    });
    modal.render({ content: orderView.render() });
});

// Нажатие кнопки перехода ко второй форме оформления заказа
document.addEventListener('order:submit', ((e: CustomEvent) => {
    const { payment, address } = e.detail;
    
    // Валидация только полей первой формы
    const errors: { [key in keyof IBuyer]?: string } = {};
    if (!payment) {
        errors.payment = 'Не выбран способ оплаты';
    }
    if (!address || address.trim() === '') {
        errors.address = 'Необходимо указать адрес доставки';
    }
    
    // Если есть ошибки, показываем их в первой форме
    if (Object.keys(errors).length > 0) {
        const orderContainer = document.createElement('div');
        const orderView = new ModalOrder(orderContainer);
        orderView.render({ 
            payment: payment || '',
            address: address || '',
            errors: errors 
        });
        modal.render({ content: orderView.render() });
        return;
    }

    // Сохраняем данные первой формы
    buyerModel.saveData({ payment, address });

    // Переход ко второй форме
    const contactsContainer = document.createElement('div');
    const contactsView = new ModalContacts(contactsContainer);
    const buyerData = buyerModel.getData();
    contactsView.render({
        email: buyerData.email,
        phone: buyerData.phone
    });
    modal.render({ content: contactsView.render() });
}) as EventListener);

// Изменение данных в формах
document.addEventListener('order:payment:change', ((e: CustomEvent) => {
    const { payment } = e.detail;
    buyerModel.saveData({ payment });
}) as EventListener);

// Нажатие кнопки оплаты/завершения оформления заказа
document.addEventListener('contacts:submit', ((e: CustomEvent) => {
    const { email, phone } = e.detail;
    
    buyerModel.saveData({ email, phone });
    const errors = buyerModel.validateData();
    
    if (Object.keys(errors).length > 0) {
        const contactsContainer = document.createElement('div');
        const contactsView = new ModalContacts(contactsContainer);
        const buyerData = buyerModel.getData();
        contactsView.render({ 
            email: buyerData.email,
            phone: buyerData.phone,
            errors 
        });
        modal.render({ content: contactsView.render() });
        return;
    }

    // Отправка заказа на сервер
    const finalData = buyerModel.getData();
    const orderData = {
        payment: finalData.payment as 'online' | 'offline',
        email: finalData.email,
        phone: finalData.phone,
        address: finalData.address,
        total: cartModel.getTotalPrice(),
        items: cartModel.getItems().map(item => item.id)
    };

    apiClient.createOrder(orderData)
        .then(result => {
            // Показываем модальное окно успешного заказа
            const successContainer = document.createElement('div');
            const successView = new ModalSuccess(successContainer);
            successView.render({ total: result.total });
            modal.render({ content: successView.render() });
            
            // Очищаем корзину и данные покупателя
            cartModel.clearCart();
            buyerModel.clearData();
        })
        .catch(error => {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при оформлении заказа. Попробуйте позже.');
        });
}) as EventListener);

// Закрытие модального окна успешного заказа
document.addEventListener('success:close', () => {
    modal.close();
});
