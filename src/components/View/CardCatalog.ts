import { CardBase, CardData } from "./CardBase";
import { IEvents } from "../base/Events";

export class CardCatalog extends CardBase {
    protected templateId = 'card-catalog';
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this.container.addEventListener('click', () => {
            const productId = this.container.dataset.id;
            if (productId) {
                this.events.emit('card:select', { id: productId });
            }
        });
    }

    render(data?: Partial<CardData>): HTMLElement {
        if (!data?.product) {
            return this.container;
        }

        this.container.dataset.id = data.product.id;
        this.setCategory(this.container, data.product.category);
        this.setTitle(this.container, data.product.title);
        this.setImage(this.container, data.product.image, data.product.title);
        this.setPrice(this.container, data.product.price);

        return this.container;
    }
}

