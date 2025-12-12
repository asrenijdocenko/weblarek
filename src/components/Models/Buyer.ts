import { IBuyer, TPayment, TError } from "../../types";
import { EventEmitter } from "../base/Events";

class Buyer extends EventEmitter {
    protected  payment: TPayment = '';
    protected  address: string = '';
    protected  email: string = '';
    protected  phone: string = '';

    saveData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        
        const orderErrors = this.validateOrderForm();
        const allErrors = this.validateData();
        
        this.emit('buyer:changed', { 
            data: this.getData(),
            orderErrors,
            allErrors
        });
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        }
    }

    clearData(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        
        const orderErrors = this.validateOrderForm();
        const allErrors = this.validateData();
        
        this.emit('buyer:changed', { 
            data: this.getData(),
            orderErrors,
            allErrors
        });
    }

    validateData(): TError {
        const errors: TError = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        
        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }
        
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        
        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
        }
        
        return errors;
    }

    validateOrderForm(): TError {
        const errors: TError = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        
        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
        }
        
        return errors;
    }
}
export { Buyer };