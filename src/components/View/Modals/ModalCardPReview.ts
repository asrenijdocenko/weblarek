import { CardBase, CardData } from "../CardBase";
import { cloneTemplate } from "../../../utils/utils";

export interface CardPreviewData extends CardData {
    isInCart: boolean;
}

export class ModalCardPreview extends CardBase {
    protected templateId = 'card-preview';
    private buttonElement: HTMLButtonElement | null = null;
    private isInCart: boolean = false;

    constructor(container: HTMLElement) {
        super(container);
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
                        const event = new CustomEvent('card:remove', { 
                            bubbles: true,
                            detail: { id: productId }
                        });
                        card.dispatchEvent(event);
                    } else {
                        const event = new CustomEvent('card:add', { 
                            bubbles: true,
                            detail: { id: productId }
                        });
                        card.dispatchEvent(event);
                    }
                }
            });
        }

        this.container.replaceWith(card);
        this.container = card;

        return this.container;
    }
}

