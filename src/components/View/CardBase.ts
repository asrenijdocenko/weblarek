import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";

export interface CardData {
    product: IProduct;
}

export abstract class CardBase extends Component<CardData> {
    protected abstract templateId: string;

    constructor(container: HTMLElement) {
        super(container);
    }

    protected createCardElement(): HTMLElement {
        const template = document.querySelector<HTMLTemplateElement>(`#${this.templateId}`);
        if (!template) {
            throw new Error(`Template with id "${this.templateId}" not found`);
        }
        return template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    }

    protected setCategory(element: HTMLElement, category: string): void {
        const categoryElement = element.querySelector('.card__category');
        if (categoryElement) {
            categoryElement.textContent = category;
            Object.values(categoryMap).forEach(modifier => {
                categoryElement.classList.remove(modifier);
            });
            const modifier = categoryMap[category as keyof typeof categoryMap];
            if (modifier) {
                categoryElement.classList.add(modifier);
            }
        }
    }

    protected setTitle(element: HTMLElement, title: string): void {
        const titleElement = element.querySelector('.card__title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    protected setImage(element: HTMLElement, image: string, alt: string): void {
        const imageElement = element.querySelector<HTMLImageElement>('.card__image');
        if (!imageElement || !image) {
            return;
        }

        let imageUrl: string;
        if (image.startsWith('http://') || image.startsWith('https://')) {
            imageUrl = image;
        } else {
            const cleanImage = image.startsWith('/') ? image.slice(1) : image;
            const cdnUrl = CDN_URL.endsWith('/') ? CDN_URL.slice(0, -1) : CDN_URL;
            imageUrl = `${cdnUrl}/${cleanImage}`;
        }
        
        imageElement.removeAttribute('src');
        imageElement.src = imageUrl;
        
        if (alt) {
            imageElement.alt = alt;
        }
    }

    protected setPrice(element: HTMLElement, price: number | null): void {
        const priceElement = element.querySelector('.card__price');
        if (priceElement) {
            if (price === null) {
                priceElement.textContent = 'Бесценно';
            } else {
                priceElement.textContent = `${price} синапсов`;
            }
        }
    }
}

