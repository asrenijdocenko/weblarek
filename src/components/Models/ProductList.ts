import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

class ProductList extends EventEmitter {
    protected _items: IProduct[] = [];
    protected _previewItem: IProduct | null = null;

    saveItems(items: IProduct[]): void  {
        this._items = [...items];
        this.emit('items:changed', { items: this._items });
    }

    getItems(): IProduct[] {
        return [...this._items]
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    } 

    savePreviewItem(item: IProduct): void {
         this._previewItem = item;
         this.emit('preview:changed', { item: this._previewItem });
    }

    getPreviewItem(): IProduct | null {
        return this._previewItem ? this._previewItem : null;
    }
}

export { ProductList };