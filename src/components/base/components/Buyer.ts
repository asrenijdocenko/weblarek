import { IBuyer, TPayment } from "../../../types";

class Buyer {
    protected _payment: TPayment = '';
    protected _address: string = '';
    protected _email: string = '';
    protected _phone: string = '';

    saveData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        }
    }

    clearData(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    validateData(): { [key in keyof IBuyer]?: string } {
        const errors: { [key in keyof IBuyer]?: string } = {};
        return errors
    }
}

export { Buyer };