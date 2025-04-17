// интерфейс формата ответа API при запросе списка товаров
export interface IProductListResponse {
  items: IProduct[];
  total: number;
  preview: string | null
}

// интерфейс самого товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// интерфейс заказа в приложении
export interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

export type PaymentMethod = 'online' | 'cash';

// интерфейс формата данных при создании заказа (отрпавляется в API)
export interface IOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// интерфейс формата ответа API после успешного создания заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// интерфейс пользователя (для взаимодейтсвия с API)
export interface IApiClient {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// интерфейс одного товара в корзине
export interface IBasketItem {
  productId: string;
  title: string;
  price: number | null;
  quantity: number;
}

export interface IBasketItemWithQuantity extends IBasketItem {
  listNumber: number;
}

// интерфейс корзины
export interface IBasket {
  items: IBasketItem[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IFormState {
  valid: boolean;
  errors: string[];
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

export  interface IUser extends IOrder {
}

export interface IAppState {
  catalog: IProduct[];
  basket: IBasketItem[];
  preview: string | null;
  order: IUser;
  loading: boolean;
}