import { IBuyer, TPayment } from "../../../types";
import { TError } from "../../../types";

class Buyer {
    protected  payment: TPayment = '';
    protected  address: string = '';
    protected  email: string = '';
    protected  phone: string = '';

    saveData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this. payment = data.payment;
        if (data.address !== undefined) this. address = data.address;
        if (data.email !== undefined) this. email = data.email;
        if (data.phone !== undefined) this. phone = data.phone;
    }

    getData(): IBuyer {
        return {
            payment: this. payment,
            address: this. address,
            email: this. email,
            phone: this. phone
        }
    }

    clearData(): void {
        this. payment = '';
        this. address = '';
        this. email = '';
        this. phone = '';
    }

    validateData(): TError {
        const errors: TError = {};
        return errors
    }
}

export { Buyer };