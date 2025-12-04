import { IProduct } from "../../types";

class Cart {
    protected items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items];
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(item: IProduct): void {
        const index = this.items.findIndex(itemToRemove => itemToRemove.id === item.id);
        this.items.splice(index, 1);
    }

    clearCart(): void {
        this.items = [];
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