import { Component } from "../base/Component";
import { HeaderData } from "../../types";
import { IEvents } from "../base/Events";

export class HeaderCartCounter extends Component<HeaderData> {
    private counterElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private events: IEvents;

    constructor(item: HTMLElement, events: IEvents) {
        super(item);
        this.events = events;

    this.counterElement = this.container.querySelector('.header__basket-counter')!;
    this.buttonElement = this.container.querySelector('.header__basket')! as HTMLButtonElement;

    this.buttonElement.addEventListener('click', () => {    
      this.events.emit('header:cart:click');
    });
    }

    public set counter(value: number) {
    if (this.counterElement) {
      this.counterElement.textContent = String(value);
    }
  }
}