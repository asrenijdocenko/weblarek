import { IBuyer, TPayment } from "../../types";
import { IOrderData } from "../../types";

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

    validateOrderData(orderData: IOrderData): string[] {
        const errors: string[] = [];
        
        if (!orderData.payment || (orderData.payment !== 'online' && orderData.payment !== 'offline')) {
            errors.push('Не выбран способ оплаты или выбран неверный способ');
        }
        
        if (!orderData.email || !orderData.email.includes('@')) {
            errors.push('Неверный email');
        }
        
        if (!orderData.phone || orderData.phone.trim().length < 5) {
            errors.push('Неверный телефон');
        }
        
        if (!orderData.address || orderData.address.trim().length === 0) {
            errors.push('Не указан адрес');
        }
        
        if (!orderData.total || orderData.total <= 0) {
            errors.push('Неверная сумма заказа');
        }
        
        if (!orderData.items || orderData.items.length === 0) {
            errors.push('Корзина пуста');
        }
        
        return errors;
    }
}

export { Buyer };