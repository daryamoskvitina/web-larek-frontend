export interface IProductListResponse {
  items: IProduct[];
  total: number;
  preview: string | null
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

export type PaymentMethod = 'online' | 'cash';

export interface IOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IApiClient {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IBasketItem {
  productId: string;
  title: string;
  price: number | null;
  quantity: number;
}

export interface IBasketItemWithQuantity extends IBasketItem {
  listNumber: number;
}

export interface IBasket {
  items: IBasketItem[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IFormState {
  valid: boolean;
  errors: string[];
}

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