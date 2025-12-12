import { Component } from "../base/Component";

export interface GaleryData {
    items: HTMLElement[];
}

export class Galery extends Component<GaleryData> {
    private catalogElement: HTMLElement;

    constructor(container: HTMLElement){
        super(container);
        this.catalogElement = this.container as HTMLElement;
    }

    set items(elements: HTMLElement[]) {
        if (!this.catalogElement) return;

        this.catalogElement.innerHTML = '';

        elements.forEach((element) => {
            this.catalogElement.appendChild(element);
        });
    }

    render(data?: Partial<GaleryData>): HTMLElement {
        if (data?.items) {
            this.items = data.items;
        }
        return this.container;
    }
}


