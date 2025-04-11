# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Приложение WebLarek разработано с использованием MVP-архитектуры (Model-View-Presenter) с применением брокера событий (EventEmitter) для взаимодействия между компонентами.

### Основные части архитектуры:

•   **Model (Модель):** Отвечает за управление данными приложения, их хранение и обработку. Модели не зависят от UI и содержат бизнес-логику.
•   **View (Представление):** Отображает данные пользователю и обрабатывает пользовательский ввод. Представления пассивны и не содержат бизнес-логики.
•   **Presenter (Представитель):** Действует как посредник между Model и View. Получает данные из Model, форматирует их для View и обрабатывает действия пользователя, передавая их в Model.
•   **API Client:** Отвечает за взаимодействие с внешним API для получения и отправки данных.
•   **Event Emitter (Брокер событий):** Обеспечивает связь между компонентами, позволяя им обмениваться информацией через события.

### Базовые классы

#### EventEmitter (src/components/base/events.ts)

•   **Предназначение:** Обеспечивает работу с событиями.
•   **Функции:**
    *   on(event: EventName, callback: (data: T) => void): Устанавливает обработчик на событие.
    *   emit(event: string, data?: T): Инициирует событие с данными.
    *   off(eventName: EventName, callback: Subscriber): Снимает обработчик с события.
    *   trigger(event: string, context?: Partial<T>): Создает коллбек-триггер, генерирующий событие при вызове.

#### Component (src/components/base/components.ts)

•   **Предназначение:** Базовый класс для всех UI-компонентов.
•   **Функции:**
    *   toggleClass(element: HTMLElement, className: string, force?: boolean): Переключает класс элемента.
    *   setText(element: HTMLElement, value: unknown): Устанавливает текстовое содержимое элемента.
    *   setDisabled(element: HTMLElement, state: boolean): Устанавливает/снимает атрибут disabled у элемента.
    *   setImage(element: HTMLImageElement, src: string, alt?: string): Устанавливает изображение и альтернативный текст.
    *   render(data?: Partial<T>): HTMLElement: Отрисовывает компонент.

#### Model (src/components/base/model.ts)

•   **Предназначение:** Базовый класс для всех моделей данных.
•   **Функции:**
    *   emitChanges(event: string, payload?: object): Сообщает всем слушателям об изменении данных в модели.

### Типы данных (src/types/index.ts)

• IProductDTO - Представляет данные о продукте, полученные из API.

interface IProductDTO {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

• IProduct - Представляет данные о продукте, используемые внутри приложения.

interface IProduct {
  id: string;
  description: string;
  imageUrl: string;
  name: string;
  category: string;
  price: number | null;
}

• IBasketItem - Представляет собой один товар в корзине.

interface IBasketItem {
  productId: string;
  name: string;
  price: number | null;
  quantity: number;
}

• IBasket - Представляет состояние корзины товаров.

interface IBasket {
  items: IBasketItem[];
  totalPrice: number;
  totalItems: number;
}

• IOrderRequest - Представляет данные, отправляемые на сервер для создания заказа.

interface IOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}


• IOrderResponse - Представляет ответ сервера после создания заказа.

interface IOrderResponse {
  id: string;
  total: number;
}

• PaymentMethod - Определяет допустимые способы оплаты.

type PaymentMethod = 'online' | 'cash';

• IFormValidation - Определяет структуру данных для валидации формы.

interface IFormValidation {
    isValid: boolean;
    errors: Record<string, string>;
}