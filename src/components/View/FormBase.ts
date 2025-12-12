import { Component } from "../base/Component";
import { TError } from "../../types";

export abstract class FormBase<T> extends Component<T> {
    protected formElement: HTMLFormElement | null = null;
    protected submitButton: HTMLButtonElement | null = null;
    protected errorsElement: HTMLElement | null = null;
    private initialized: boolean = false;

    constructor(container: HTMLElement) {
        super(container);
    }

    protected initializeForm(): void {
        if (this.initialized) return;
        
        this.formElement = this.container.querySelector('form') as HTMLFormElement;
        this.submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = this.container.querySelector('.form__errors') as HTMLElement;

        if (this.formElement) {
            this.formElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            this.formElement.addEventListener('input', () => {
                this.handleInput();
            });
        }

        this.initialized = true;
    }

    protected abstract handleSubmit(): void;
    protected abstract handleInput(): void;

    protected setErrors(errors: TError): void {
        if (!this.errorsElement) {
            this.errorsElement = this.container.querySelector('.form__errors') as HTMLElement;
        }
        if (!this.errorsElement) return;

        const errorMessages = Object.values(errors).filter(Boolean);
        if (errorMessages.length > 0) {
            this.errorsElement.textContent = errorMessages.join(', ');
        } else {
            this.errorsElement.textContent = '';
        }
    }

    protected validateForm(): boolean {
        return true;
    }

    protected setButtonState(enabled: boolean): void {
        if (!this.submitButton) {
            this.submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        }
        if (this.submitButton) {
            this.submitButton.disabled = !enabled;
        }
    }
}

