import { CardBase, CardData } from "./CardBase";
import { IEvents } from "../base/Events";

export class CardBasket extends CardBase {
    protected templateId = 'card-basket';
    private deleteButton: HTMLButtonElement | null = null;
    private indexElement: HTMLElement | null = null;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
        this.indexElement = this.container.querySelector('.basket__item-index') as HTMLElement;

        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', () => {
                const productId = this.container.dataset.id;
                if (productId) {
                    this.events.emit('basket:remove', { id: productId });
                }
            });
        }
    }

    render(data?: Partial<CardData & { index: number }>): HTMLElement {
        if (!data?.product) {
            return this.container;
        }

        this.container.dataset.id = data.product.id;
        this.setTitle(this.container, data.product.title);
        this.setPrice(this.container, data.product.price);

        if (this.indexElement && data.index !== undefined) {
            this.indexElement.textContent = String(data.index + 1);
        }

        return this.container;
    }
}

