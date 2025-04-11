// интерфейс структуры отдельного товара (из API)
export interface IProductDTO {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
}

// интерфейс формата ответа API при запросе списка товаров
export interface IProductListResponse {
  items: IProductDTO[];
  total: number;
}

// интерфейс формата данных при создании заказа (отрпавляется в API)
export interface IOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number; // общая стоимость
  items: string[];
}

// интерфейс формата ответа API после успешного создания заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// интерфейс пользователя (для взаимодейтсвия с API)
export interface IApiClient {
  getProducts(): Promise<IProductListResponse>; // метод получения списка товаров
  getProduct(id: string): Promise<IProductDTO | undefined>; // метод получения информации о конкретном товаре по его id, возвращает undefined, если товар не найден
  createOrder(order: IOrderRequest): Promise<IOrderResponse>; // метод для отправки запроса на создание заказа
}

// интерфейс самого товара (в самом приложении, тк может отличаться от IProductDTO)
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// интерфейс одного товара в корзине
export interface IBasketItem {
  productId: string;
  title: string;
  price: number | null;
  quantity: number; // количество товаров этого вида
}

// интерфейс корзины
export interface IBasket {
  items: IBasketItem[];
}

// интерфейс заказа в приложении
export interface IOrder {
  paymentMethod: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  items: string[];
}

export type PaymentMethod = 'online' | 'cash';

// валидация
export interface IFormValidation {
    isValid: boolean;
    errors: Record<string, string>;
}

// допустимые HTTP-методы
export type ApiPostMethods = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export enum AppEvents {
  PRODUCT_ADDED_TO_BASKET = 'product_added_to_basket',
  PRODUCT_REMOVED_FROM_BASKET = 'product_removed_from_basket',
  BASKET_UPDATED = 'basket_updated',
  ORDER_SUBMITTED = 'order_submitted',
  ORDER_SUCCESS = 'order_success',
  ORDER_FAILED = 'order_failed',
  MODAL_OPENED = 'modal_opened',
  MODAL_CLOSED = 'modal_closed',
  PAYMENT_METHOD_SELECTED = "payment_method_selected",
  ADDRESS_FILLED = "address_filled",
  CONTACTS_FILLED = "contacts_filled"
}

export interface IEventPayload<T> {
  event: AppEvents;
  data?: T;
}