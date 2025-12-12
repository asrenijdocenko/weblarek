import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface CartData {
    items: HTMLElement[];
    total: number;
}

export class ModalCart extends Component<CartData> {
    private listElement: HTMLElement;
    private totalPriceElement: HTMLElement;
    private orderButton: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.listElement = this.container.querySelector('.basket__list') as HTMLElement;
        this.totalPriceElement = this.container.querySelector('.basket__price') as HTMLElement;
        this.orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;

        if (this.orderButton) {
            this.orderButton.addEventListener('click', () => {
                this.events.emit('cart:order');
            });
        }
    }

    set cart(data: CartData) {
        if (data.items.length === 0) {
            this.listElement.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
            this.totalPriceElement.textContent = '0 синапсов';
            this.orderButton.disabled = true;
            return;
        }

        this.listElement.innerHTML = '';
        data.items.forEach((element) => {
            this.listElement.appendChild(element);
        });

        this.totalPriceElement.textContent = `${data.total} синапсов`;
        this.orderButton.disabled = false;
    }

    render(data?: Partial<CartData>): HTMLElement {
        if (data) {
            this.cart = data as CartData;
        }
        return this.container;
    }
}

