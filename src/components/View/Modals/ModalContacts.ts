import { FormBase } from "../FormBase";
import { cloneTemplate } from "../../../utils/utils";
import { IBuyer } from "../../../types";

export interface ContactsData {
    email?: string;
    phone?: string;
    errors?: { [key in keyof IBuyer]?: string };
}

export class ModalContacts extends FormBase<ContactsData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLElement) {
        super(container);

        if (!this.container.querySelector('.form')) {
            const template = cloneTemplate<HTMLElement>('#contacts');
            this.container.appendChild(template);
        }

        this.initializeForm();

        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
    }

    protected handleSubmit(): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        const errors: { [key in keyof IBuyer]?: string } = {};

        if (!email) {
            errors.email = 'Необходимо указать email';
        }

        if (!phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (Object.keys(errors).length > 0) {
            this.setErrors(errors);
            this.setButtonState(false);
            return;
        }

        const event = new CustomEvent('contacts:submit', {
            bubbles: true,
            detail: {
                email: email,
                phone: phone
            }
        });
        this.container.dispatchEvent(event);
    }

    protected handleInput(): void {
        this.validateForm();
    }

    protected validateForm(): boolean {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        const isValid = email !== '' && phone !== '';

        this.setButtonState(isValid);
        return isValid;
    }

    render(data?: Partial<ContactsData>): HTMLElement {
        if (data?.email) {
            this.emailInput.value = data.email;
        }

        if (data?.phone) {
            this.phoneInput.value = data.phone;
        }

        if (data?.errors) {
            this.setErrors(data.errors);
        }

        this.validateForm();
        return this.container;
    }
}

