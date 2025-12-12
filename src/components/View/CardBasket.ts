import { CardBase, CardData } from "./CardBase";
import { cloneTemplate } from "../../utils/utils";

export class CardBasket extends CardBase {
    protected templateId = 'card-basket';
    private deleteButton: HTMLButtonElement | null = null;

    constructor(container: HTMLElement) {
        super(container);
    }

    render(data?: Partial<CardData & { index: number }>): HTMLElement {
        if (!data?.product) {
            return this.container;
        }

        const card = cloneTemplate<HTMLElement>(`#${this.templateId}`);
        card.dataset.id = data.product.id;

        this.setTitle(card, data.product.title);
        this.setPrice(card, data.product.price);

        const indexElement = card.querySelector('.basket__item-index');
        if (indexElement && data.index !== undefined) {
            indexElement.textContent = String(data.index + 1);
        }

        this.container.replaceWith(card);
        this.container = card;
        this.deleteButton = card.querySelector('.basket__item-delete') as HTMLButtonElement;

        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', () => {
                const productId = this.container.dataset.id;
                if (productId) {
                    const event = new CustomEvent('basket:remove', { 
                        bubbles: true,
                        detail: { id: productId }
                    });
                    this.container.dispatchEvent(event);
                }
            });
        }

        return this.container;
    }
}

