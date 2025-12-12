import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

class Cart extends EventEmitter {
    protected items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items];
    }

    addItem(item: IProduct): void {
        this.items.push(item);
        this.emit('cart:changed', { items: this.items });
    }

    removeItem(item: IProduct): void {
        const index = this.items.findIndex(itemToRemove => itemToRemove.id === item.id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.emit('cart:changed', { items: this.items });
        }
    }

    clearCart(): void {
        this.items = [];
        this.emit('cart:changed', { items: this.items });
    }

    getTotalPrice(): number {
        return this.items.reduce((total: number, item: IProduct) => {
            return total + (item.price || 0)
        }, 0);
    }

    getTotalCount(): number {
        return this.items.length;
    }

    checkItemInCart(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}

export { Cart };