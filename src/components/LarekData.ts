import { Model } from "./base/model";
import { IProduct, IUser, IAppState, FormErrors } from "../types";

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
  basket: IProduct[] = [];
	catalog: IProduct[];
  order: Omit<IUser, 'total' | 'items'> = {
    payment: '',
		email: '',
		phone: '',
		address: '',
  };
  preview: string;
	formErrors: FormErrors = {};

  setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setBasket(item: IProduct) {
		this.basket.push(item);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

  clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', {basket: this.basket});
	}

  clearOrder() {
		this.order = {
			payment: '',
			email: '',
			phone: '',
			address: '',
	};
	}

  checkCard(id: string) {
		return this.basket.some((el) => el.id === id);
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

  removeFromBasket(id: string) {
		this.basket = this.basket.filter((el) => el.id !== id);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

  getTotal() {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

  getBasketNumber() {
		return this.basket.length;
	}

	setOrderField<K extends keyof Omit<IUser, 'total' | 'items'>>(field: K, value: IUser[K]) {
		this.order[field] = value;
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}