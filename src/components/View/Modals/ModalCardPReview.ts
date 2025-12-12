import { CardBase, CardData } from "../CardBase";
import { cloneTemplate } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface CardPreviewData extends CardData {
    isInCart: boolean;
}

export class ModalCardPreview extends CardBase {
    protected templateId = 'card-preview';
    private buttonElement: HTMLButtonElement | null = null;
    private isInCart: boolean = false;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
    }

    render(data?: Partial<CardPreviewData>): HTMLElement {
        if (!data?.product) {
            return this.container;
        }

        const card = cloneTemplate<HTMLElement>(`#${this.templateId}`);
        card.dataset.id = data.product.id;
        this.isInCart = data.isInCart || false;

        this.setCategory(card, data.product.category);
        this.setTitle(card, data.product.title);
        this.setImage(card, data.product.image, data.product.title);
        this.setPrice(card, data.product.price);

        const descriptionElement = card.querySelector('.card__text');
        if (descriptionElement) {
            descriptionElement.textContent = data.product.description;
        }

        this.buttonElement = card.querySelector('.card__button') as HTMLButtonElement;

        if (this.buttonElement) {
            if (data.product.price === null) {
                this.buttonElement.textContent = 'Недоступно';
                this.buttonElement.disabled = true;
            } else if (this.isInCart) {
                this.buttonElement.textContent = 'Удалить из корзины';
                this.buttonElement.disabled = false;
            } else {
                this.buttonElement.textContent = 'В корзину';
                this.buttonElement.disabled = false;
            }
        }

        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {
                const productId = card.dataset.id;
                if (productId) {
                    if (this.isInCart) {
                        this.events.emit('card:remove', { id: productId });
                    } else {
                        this.events.emit('card:add', { id: productId });
                    }
                }
            });
        }

        this.container.replaceWith(card);
        this.container = card;

        return this.container;
    }
}

