import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { IBasketItem } from "../types";

interface IBasketView {
  items: IBasketItem[];
  total: number | null;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  
  private _basketItems: HTMLElement[] = [];

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    this.items = [];

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }
  }

  set total(total: number) {
    this.setText(this._total, total + ' синапсов');
  }

  set items(items: HTMLElement[]) {
    this._basketItems = items;

    if (items.length) {
      this._list.replaceChildren(...items);
      this.setDisabled(this._button, false);
    } else {
      this.setDisabled(this._button, true);

      this._list.replaceChildren(this.createEmptyBasketElement());
    }
  }

  get items(): HTMLElement[] {
    return this._basketItems;
  }

  private createEmptyBasketElement(): HTMLElement {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Корзина пуста';
    return emptyMessage;
  }
}