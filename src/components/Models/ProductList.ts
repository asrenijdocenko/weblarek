import { IProduct } from "../../types";

class ProductList {
    protected _items: IProduct[] = [];
    protected _previewItem: IProduct | null = null;

    saveItems(items: IProduct[]): void  {
        this._items = [...items]
    }

    getItems(): IProduct[] {
        return [...this._items]
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    } 

    savePreviewItem(item: IProduct): void {
         this._previewItem = item;
    }

    getPreviewItem(): IProduct | null {
        return this._previewItem ? this._previewItem : null;
    }
}

export { ProductList };