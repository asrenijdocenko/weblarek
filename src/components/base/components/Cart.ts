import { IProduct } from "../../../types";

class Cart {
    protected _items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this._items];
    }

    addItem(item: IProduct): void {
        this._items.push(item);
    }

    removeItem(item: IProduct): void {
        const index = this._items.findIndex(itemToRemove => itemToRemove.id === item.id);
        this._items.splice(index, 1);
    }

    clearCart(): void {
        this._items = [];
    }

    getTotalPrice(): number {
        return this._items.reduce((total: number, item: IProduct) => {
            return total + (item.price || 0)
        }, 0);
    }

    getTotalCount(): number {
        return this._items.length;
    }

    checkItemInCart(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}

export { Cart };