import { Component } from "../base/Component";
import { HeaderData } from "../../types";

export class HeaderCartCounter extends Component<HeaderData> {
    private counterElement: HTMLElement;
    private buttonElement: HTMLButtonElement;

    constructor(item: HTMLElement) {
        super(item);

    this.counterElement = this.container.querySelector('.header__basket-counter')!;
    this.buttonElement = this.container.querySelector('.header__basket')! as HTMLButtonElement;

    this.buttonElement.addEventListener('click', () => {    
      const event = new CustomEvent('header:cart:click', { bubbles: true });
      this.container.dispatchEvent(event);
    });
    }

    public set counter(value: number) {
    if (this.counterElement) {
      this.counterElement.textContent = String(value);
    }
  }
}