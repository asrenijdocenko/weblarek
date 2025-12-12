import { Component } from "../../base/Component";
import { cloneTemplate } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { CardBasket } from "../CardBasket";

export interface CartData {
    items: IProduct[];
    total: number;
}

export class ModalCart extends Component<CartData> {
    private listElement: HTMLElement;
    private totalPriceElement: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        if (!this.container.querySelector('.basket')) {
            const template = cloneTemplate<HTMLElement>('#basket');
            this.container.appendChild(template);
        }

        this.listElement = this.container.querySelector('.basket__list') as HTMLElement;
        this.totalPriceElement = this.container.querySelector('.basket__price') as HTMLElement;
        this.orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;

        if (this.orderButton) {
            this.orderButton.addEventListener('click', () => {
                const event = new CustomEvent('cart:order', { bubbles: true });
                this.container.dispatchEvent(event);
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
        data.items.forEach((item, index) => {
            const cardContainer = document.createElement('li');
            const card = new CardBasket(cardContainer);
            const renderedCard = card.render({ product: item, index });
            this.listElement.appendChild(renderedCard);
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

