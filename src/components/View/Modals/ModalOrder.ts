import { FormBase } from "../FormBase";
import { cloneTemplate } from "../../../utils/utils";
import { IBuyer, TPayment } from "../../../types";

export interface OrderData {
    payment?: TPayment;
    address?: string;
    errors?: { [key in keyof IBuyer]?: string };
}

export class ModalOrder extends FormBase<OrderData> {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;
    private selectedPayment: TPayment = '';

    constructor(container: HTMLElement) {
        super(container);

        if (!this.container.querySelector('.form')) {
            const template = cloneTemplate<HTMLElement>('#order');
            this.container.appendChild(template);
        }

        this.initializeForm();

        this.paymentButtons = this.container.querySelectorAll('button[name]') as NodeListOf<HTMLButtonElement>;
        this.addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.name as 'card' | 'cash';
                this.selectPayment(paymentType);
            });
        });
    }

    private selectPayment(type: 'card' | 'cash'): void {
        this.selectedPayment = type === 'card' ? 'online' : 'offline';
        
        this.paymentButtons.forEach(button => {
            if (button.name === type) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });

        const event = new CustomEvent('order:payment:change', {
            bubbles: true,
            detail: { payment: this.selectedPayment }
        });
        this.container.dispatchEvent(event);

        this.validateForm();
    }

    protected handleSubmit(): void {
        const address = this.addressInput.value.trim();
        const errors: { [key in keyof IBuyer]?: string } = {};

        if (!this.selectedPayment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!address) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        if (Object.keys(errors).length > 0) {
            this.setErrors(errors);
            this.setButtonState(false);
            return;
        }

        const event = new CustomEvent('order:submit', {
            bubbles: true,
            detail: {
                payment: this.selectedPayment,
                address: address
            }
        });
        this.container.dispatchEvent(event);
    }

    protected handleInput(): void {
        this.validateForm();
    }

    protected validateForm(): boolean {
        const address = this.addressInput.value.trim();
        const isValid = this.selectedPayment !== '' && address !== '';

        this.setButtonState(isValid);
        return isValid;
    }

    render(data?: Partial<OrderData>): HTMLElement {
        if (data?.payment) {
            this.selectedPayment = data.payment;
            const paymentType = data.payment === 'online' ? 'card' : 'cash';
            this.paymentButtons.forEach(button => {
                if (button.name === paymentType) {
                    button.classList.add('button_alt-active');
                } else {
                    button.classList.remove('button_alt-active');
                }
            });
        }

        if (data?.address) {
            this.addressInput.value = data.address;
        }

        if (data?.errors) {
            this.setErrors(data.errors);
        }

        this.validateForm();
        return this.container;
    }
}

