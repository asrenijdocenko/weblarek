import { Component } from "../base/Component";
import { GaleryData } from "../../types";

export class Galery extends Component<GaleryData> {
    
    private catalog: HTMLElement;

    constructor(item: HTMLElement){
        super(item);
        this.catalog = this.container as HTMLElement;
    }

    public set catalogSet(items: GaleryData['catalog']) {
        if (!this.catalog) return;

        this.catalog.innerHTML = '';

        items.forEach((item) => {
        this.catalog.appendChild(item);
        });
        }
    
  }


