import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekApi';
import { AppState, CatalogChangeEvent, ProductItem } from './components/LarekData';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Product, CardProductItem, BasketCard } from './components/Card';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { IOrder } from './types';
import { Success } from './components/Success';

const api = new LarekAPI (CDN_URL, API_URL);
const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({
	basket: [],
	catalog: [],
	preview: null,
	order: {
		payment: '',
		email:'',
		phone: '',
		address: '',
		total: 0,
		items: [],
	}
}, events);


api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.then(()=> console.log(appData.catalog))
	.catch((err) => {
		console.error(err);
	});

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

events.on('card:select', (item: ProductItem) => {
	console.log('card:select');
	appData.setPreview(item);
});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Product('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:select', item);
			},
		});

		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		});
	});
});

const updateBasketList = () => {
	let listNumber = 0;
	basket.items = appData.getBasket().map((item) => {
		listNumber = listNumber + 1;
		const card = new BasketCard('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delete-card', item);
			},
		});
				card.listNumber = listNumber;
				return card.render({
					title: item.title,
					price: item.price,
				});
	});
};

events.on('basket:delete-card', (item: ProductItem) => {
	appData.removeFromBasket(item.id);
	basket.total = appData.getTotal();
	page.counter = appData.getBasketNumber();
	updateBasketList();
});

events.on('basket:change', (item: ProductItem) => {
	console.log('basket:change');

	if (!appData.checkCard(item.id)) {
		appData.setBasket(item);
		appData.setItems(item);
	}

	basket.total = appData.getTotal();
	page.counter = appData.getBasketNumber();

	console.log("Содержимое корзины:", appData.getBasket())

	updateBasketList();
});

events.on('preview:changed', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const card = new CardProductItem(cloneTemplate(cardPreviewTemplate), {
			onClick: (e) => {
				events.emit('basket:change', item);
				modal.close();
			},
		});
		if (appData.checkCard(item.id)) {
			card.changeButton();
		}
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				category: item.category,
				price: item.price,
				id: item.id,
			}),
		});
	};

	if (item) {
		api
			.getCardItem(item.id)
			.then((result) => {
				item.description = result.description;
				(item.title = result.title),
					(item.image = result.image),
					showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('basket:open', () => {
	console.log('basket:open');
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

events.on('order:open', () => {
	console.log(appData.order);
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	console.log('order:open');
});

events.on('contacts:open', () => {
	console.log('contacts:open');
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	'payment:change',
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
		console.log('payment:change');
	}
);

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { address, phone, email, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone && Boolean(appData.getTotal());
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	console.log('contacts:submit');
	api
		.orderLots(appData.order)
		.then((result) => {
			appData.clearBasket();
			appData.clearOrder();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					order.reset();
					contacts.reset();
				},
			});
			success.total = result.total;
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});