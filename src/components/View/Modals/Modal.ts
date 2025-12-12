import { Component } from "../../base/Component";

export interface ModalData {
    content: HTMLElement;
}

export class Modal extends Component<ModalData> {
    private closeButton: HTMLButtonElement;
    private contentElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
        this.contentElement = this.container.querySelector('.modal__content') as HTMLElement;

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });

        const modalContainer = this.container.querySelector('.modal__container');
        if (modalContainer) {
            modalContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    set content(value: HTMLElement) {
        if (this.contentElement) {
            this.contentElement.innerHTML = '';
            this.contentElement.appendChild(value);
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        
        const event = new CustomEvent('modal:close', { bubbles: true });
        this.container.dispatchEvent(event);
    }

    render(data?: Partial<ModalData>): HTMLElement {
        if (data?.content) {
            this.content = data.content;
        }
        return this.container;
    }
}

