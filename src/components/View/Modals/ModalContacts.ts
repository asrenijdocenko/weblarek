import { FormBase } from "../FormBase";
import { IBuyer } from "../../../types";
import { IEvents } from "../../base/Events";

export interface ContactsData {
    email?: string;
    phone?: string;
    errors?: { [key in keyof IBuyer]?: string };
    submitButtonEnabled?: boolean;
}

export class ModalContacts extends FormBase<ContactsData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.initializeForm();

        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
    }

    protected handleSubmit(): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        this.events.emit('contacts:submit', {
            email: email,
            phone: phone
        });
    }

    protected handleInput(): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        this.events.emit('contacts:field:change', { email, phone });
    }

    render(data?: Partial<ContactsData>): HTMLElement {
        if (data?.email !== undefined) {
            this.emailInput.value = data.email;
        }

        if (data?.phone !== undefined) {
            this.phoneInput.value = data.phone;
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

