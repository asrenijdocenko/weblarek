import { IBuyer, TPayment } from "../../types";

class Buyer {
    protected  payment: TPayment = '';
    protected  address: string = '';
    protected  email: string = '';
    protected  phone: string = '';

    saveData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
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
    }

    validateByerInfo(): string[] {
        const errors: string[]= [];

        if (!this.payment) {
            errors.push('Не выбран способ оплаты ');
        }
        
        if (!this.email) {
            errors.push('необходимо указать email');
        }
        
        if (!this.phone) {
            errors.push('необходимо указать телефон');
        }
        
        if (!this.address) {
            errors.push('необходимо указать адрес');
        }
        
        return errors;
    }
}
export { Buyer };