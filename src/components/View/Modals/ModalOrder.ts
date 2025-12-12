import { FormBase } from "../FormBase";
import { IBuyer, TPayment } from "../../../types";
import { IEvents } from "../../base/Events";

export interface OrderData {
    payment?: TPayment;
    address?: string;
    errors?: { [key in keyof IBuyer]?: string };
    submitButtonEnabled?: boolean;
}

export class ModalOrder extends FormBase<OrderData> {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;
    private selectedPayment: TPayment = '';
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

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
        const payment = type === 'card' ? 'online' : 'offline';
        this.events.emit('order:payment:change', { payment });
    }

    protected handleSubmit(): void {
        const address = this.addressInput.value.trim();
        this.events.emit('order:submit', {
            payment: this.selectedPayment,
            address: address
        });
    }

    protected handleInput(): void {
        const address = this.addressInput.value.trim();
        this.events.emit('order:address:change', { address });
    }

    render(data?: Partial<OrderData>): HTMLElement {
        if (data?.payment !== undefined) {
            this.selectedPayment = data.payment;
            if (data.payment) {
                const paymentType = data.payment === 'online' ? 'card' : 'cash';
                this.paymentButtons.forEach(button => {
                    if (button.name === paymentType) {
                        button.classList.add('button_alt-active');
                    } else {
                        button.classList.remove('button_alt-active');
                    }
                });
            } else {
                this.paymentButtons.forEach(button => {
                    button.classList.remove('button_alt-active');
                });
            }
        }

        if (data?.address !== undefined) {
            this.addressInput.value = data.address;
        }

        if (data?.errors) {
            this.setErrors(data.errors);
        }

        if (data?.submitButtonEnabled !== undefined) {
            this.setButtonState(data.submitButtonEnabled);
        }

        return this.container;
    }
}

