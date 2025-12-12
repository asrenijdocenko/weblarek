import { Component } from "../../base/Component";
import { cloneTemplate } from "../../../utils/utils";

export interface SuccessData {
    total: number;
}

export class ModalSuccess extends Component<SuccessData> {
    private closeButton: HTMLButtonElement;
    private totalElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        if (!this.container.querySelector('.order-success')) {
            const template = cloneTemplate<HTMLElement>('#success');
            this.container.appendChild(template);
        }

        this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
        this.totalElement = this.container.querySelector('.order-success__description') as HTMLElement;

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                const event = new CustomEvent('success:close', { bubbles: true });
                this.container.dispatchEvent(event);
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

