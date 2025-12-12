import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface SuccessData {
    total: number;
}

export class ModalSuccess extends Component<SuccessData> {
    private closeButton: HTMLButtonElement;
    private totalElement: HTMLElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
        this.totalElement = this.container.querySelector('.order-success__description') as HTMLElement;

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.events.emit('success:close');
            });
        }
    }

    set info(data: SuccessData) {
        if (this.totalElement) {
            this.totalElement.textContent = `Списано ${data.total} синапсов`;
        }
    }

    render(data?: Partial<SuccessData>): HTMLElement {
        if (data) {
            this.info = data as SuccessData;
        }
        return this.container;
    }
}

