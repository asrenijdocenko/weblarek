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
import { CardCatalog } from './components/View/CardCatalog';
import { CardBasket } from './components/View/CardBasket';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate } from './utils/utils';
import { IBuyerChangedEvent } from './types';
import { TPayment } from './types';

import './scss/styles.scss';
import { ApiClient } from './components/base/ApiClient';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

const events = new EventEmitter();

const productsModel = new ProductList();
const cartModel = new CartModel();
const buyerModel = new Buyer();

const api = new Api(API_URL);
const apiClient = new ApiClient(api);

const headerCounter = new HeaderCartCounter(document.querySelector('.header')!, events);
const gallery = new Galery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('#modal-container')!);

const orderTemplate = cloneTemplate<HTMLElement>('#order');
const orderContainer = document.createElement('div');
orderContainer.appendChild(orderTemplate);
const orderView = new ModalOrder(orderContainer, events);

const contactsTemplate = cloneTemplate<HTMLElement>('#contacts');
const contactsContainer = document.createElement('div');
contactsContainer.appendChild(contactsTemplate);
const contactsView = new ModalContacts(contactsContainer, events);

const successTemplate = cloneTemplate<HTMLElement>('#success');
const successContainer = document.createElement('div');
successContainer.appendChild(successTemplate);
const successView = new ModalSuccess(successContainer, events);

const cartTemplate = cloneTemplate<HTMLElement>('#basket');
const cartContainer = document.createElement('div');
cartContainer.appendChild(cartTemplate);
const cartView = new ModalCart(cartContainer, events);

const previewTemplate = cloneTemplate<HTMLElement>('#card-preview');
const previewContainer = document.createElement('div');
previewContainer.appendChild(previewTemplate);
const previewCard = new ModalCardPreview(previewContainer, events);

apiClient.getProductList()
    .then(products => {
        productsModel.saveItems(products.items);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });


productsModel.on('items:changed', () => {
    const items = productsModel.getItems().map(product => {
        const cardTemplate = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(cardTemplate, events);
        return card.render({ product });
    });
    gallery.render({ items });
});

productsModel.on('preview:changed', () => {
    const previewItem = productsModel.getPreviewItem();
    if (previewItem) {
        const isInCart = cartModel.checkItemInCart(previewItem.id);
        previewCard.render({ product: previewItem, isInCart });
        modal.render({ content: previewCard.render() });
        modal.open();
    }
});

cartModel.on('cart:changed', () => {
    headerCounter.render({ counter: cartModel.getTotalCount() });
});

let shouldSubmitOrder = false;
let shouldGoToContacts = false;

buyerModel.on('buyer:changed', ({ data, orderErrors, allErrors }: IBuyerChangedEvent) => {
    const currentContent = document.querySelector('.modal__content')?.firstElementChild;
    
    if (currentContent === orderContainer) {
        const isValid = Object.keys(orderErrors).length === 0;
        orderView.render({
            payment: data.payment,
            address: data.address,
            errors: orderErrors,
            submitButtonEnabled: isValid
        });
        
        if (shouldGoToContacts && isValid && data.payment && data.address) {
            shouldGoToContacts = false;
            const isValidContacts = Object.keys(allErrors).length === 0;
            contactsView.render({
                email: data.email,
                phone: data.phone,
                errors: allErrors,
                submitButtonEnabled: isValidContacts
            });
            modal.render({ content: contactsView.render() });
        }
    }
    
    if (currentContent === contactsContainer) {
        const isValid = Object.keys(allErrors).length === 0;
        contactsView.render({
            email: data.email,
            phone: data.phone,
            errors: allErrors,
            submitButtonEnabled: isValid
        });
        
        if (shouldSubmitOrder && isValid) {
            shouldSubmitOrder = false;
            
            const orderData = {
                payment: data.payment as 'online' | 'offline',
                email: data.email,
                phone: data.phone,
                address: data.address,
                total: cartModel.getTotalPrice(),
                items: cartModel.getItems().map(item => item.id)
            };

            apiClient.createOrder(orderData)
                .then(result => {
                    successView.render({ total: result.total });
                    modal.render({ content: successView.render() });
                    
                    cartModel.clearCart();
                    buyerModel.clearData();
                })
                .catch(error => {
                    console.error('Ошибка при оформлении заказа:', error);
                    const errorMessage = 'Произошла ошибка при оформлении заказа. Попробуйте позже.';
                    contactsView.render({
                        email: data.email,
                        phone: data.phone,
                        errors: { email: errorMessage },
                        submitButtonEnabled: false
                    });
                    modal.render({ content: contactsView.render() });
                });
        } else if (shouldSubmitOrder) {
            shouldSubmitOrder = false;
        }
    }
});


events.on('card:select', ({ id }: { id: string }) => {
    const product = productsModel.getItem(id);
    if (product) {
        productsModel.savePreviewItem(product);
    }
});

events.on('card:add', ({ id }: { id: string }) => {
    const product = productsModel.getItem(id);
    if (product) {
        cartModel.addItem(product);
        modal.close();
    }
});

events.on('card:remove', ({ id }: { id: string }) => {
    const product = productsModel.getItem(id);
    if (product) {
        cartModel.removeItem(product);
        modal.close();
    }
});

events.on('header:cart:click', () => {
    const items = cartModel.getItems().map((item, index) => {
        const cardTemplate = cloneTemplate<HTMLElement>('#card-basket');
        const card = new CardBasket(cardTemplate, events);
        return card.render({ product: item, index });
    });
    
    cartView.render({
        items: items,
        total: cartModel.getTotalPrice()
    });
    modal.render({ content: cartView.render() });
    modal.open();
});

events.on('basket:remove', ({ id }: { id: string }) => {
    const product = productsModel.getItem(id);
    if (product) {
        cartModel.removeItem(product);
        const currentContent = document.querySelector('.modal__content')?.firstElementChild as HTMLElement;
        if (currentContent === cartContainer) {
            const items = cartModel.getItems().map((item, index) => {
                const cardTemplate = cloneTemplate<HTMLElement>('#card-basket');
                const card = new CardBasket(cardTemplate, events);
                return card.render({ product: item, index });
            });
            
            cartView.render({
                items: items,
                total: cartModel.getTotalPrice()
            });
        }
    }
});

events.on('cart:order', () => {
    const buyerData = buyerModel.getData();
    buyerModel.saveData({ payment: buyerData.payment, address: buyerData.address });
    modal.render({ content: orderView.render() });
    modal.open();
});

events.on('order:payment:change', ({ payment }: { payment: TPayment }) => {
    buyerModel.saveData({ payment });
});

events.on('order:address:change', ({ address }: { address: string }) => {
    buyerModel.saveData({ address });
});

events.on('order:submit', ({ payment, address }: { payment: TPayment; address: string }) => {
    shouldGoToContacts = true;
    buyerModel.saveData({ payment, address });
});

events.on('contacts:field:change', ({ email, phone }: { email: string; phone: string }) => {
    buyerModel.saveData({ email, phone });
});

events.on('contacts:submit', ({ email, phone }: { email: string; phone: string }) => {
    shouldSubmitOrder = true;
    buyerModel.saveData({ email, phone });
});

events.on('success:close', () => {
    modal.close();
});
