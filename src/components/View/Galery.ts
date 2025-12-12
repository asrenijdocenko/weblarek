import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { CardCatalog } from "./CardCatalog";

export interface GaleryData {
    catalog: IProduct[];
}

export class Galery extends Component<GaleryData> {
    private catalogElement: HTMLElement;

    constructor(container: HTMLElement){
        super(container);
        this.catalogElement = this.container as HTMLElement;
    }

    set catalog(items: IProduct[]) {
        if (!this.catalogElement) return;

        this.catalogElement.innerHTML = '';

        items.forEach((product) => {
            const cardContainer = document.createElement('button');
            cardContainer.className = 'gallery__item';
            const card = new CardCatalog(cardContainer);
            const renderedCard = card.render({ product });
            this.catalogElement.appendChild(renderedCard);
        });
    }

    render(data?: Partial<GaleryData>): HTMLElement {
        if (data?.catalog) {
            this.catalog = data.catalog;
        }
        return this.container;
    }
}


