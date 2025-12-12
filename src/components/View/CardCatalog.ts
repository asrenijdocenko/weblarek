import { CardBase, CardData } from "./CardBase";
import { cloneTemplate } from "../../utils/utils";

export class CardCatalog extends CardBase {
    protected templateId = 'card-catalog';
    private buttonElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.buttonElement = this.container;
        
        this.buttonElement.addEventListener('click', () => {
            const productId = this.container.dataset.id;
            if (productId) {
                const event = new CustomEvent('card:select', { 
                    bubbles: true,
                    detail: { id: productId }
                });
                this.container.dispatchEvent(event);
            }
        });
    }

    render(data?: Partial<CardData>): HTMLElement {
        if (!data?.product) {
            return this.container;
        }

        const card = cloneTemplate<HTMLElement>(`#${this.templateId}`);
        card.dataset.id = data.product.id;

        this.setCategory(card, data.product.category);
        this.setTitle(card, data.product.title);
        this.setImage(card, data.product.image, data.product.title);
        this.setPrice(card, data.product.price);

        card.addEventListener('click', () => {
            const productId = card.dataset.id;
            if (productId) {
                const event = new CustomEvent('card:select', { 
                    bubbles: true,
                    detail: { id: productId }
                });
                card.dispatchEvent(event);
            }
        });

        this.container.replaceWith(card);
        this.container = card;
        this.buttonElement = card;

        return this.container;
    }
}

