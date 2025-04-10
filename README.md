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

### Описание компонентов

Ниже описаны компоненты, их атрибуты и методы.

#### ProductModel

•   **Предназначение:** Управление данными о товаре.

•   **Атрибуты:**

    *   id: string - Уникальный идентификатор товара.
    *   title: string - Название товара.
    *   category: string - Категория товара.
    *   description: string - Описание товара.
    *   image: string - URL изображения товара.
    *   price: number | null - Цена товара.

•   **Методы:**

    *   constructor(data: Partial<IProductDTO>, events: IEvents) - Конструктор класса, принимает данные товара и объект EventEmitter.
    *   emitChanges(event: string, payload?: object) -  Уведомляет об изменении данных товара.

#### BasketModel

•   **Предназначение:** Управление данными корзины.

•   **Атрибуты:**

    *   items: IBasketItem[] - Массив товаров в корзине.

•   **Методы:**

    *   addItem(product: IProduct): void - Добавляет товар в корзину.  Если товар уже есть, увеличивает количество.  Генерирует событие PRODUCT_ADDED_TO_BASKET.
    *   removeItem(productId: string): void - Удаляет товар из корзины.  Генерирует событие PRODUCT_REMOVED_FROM_BASKET.
    *   changeQuantity(productId: string, quantity: number): void - Изменяет количество товара в корзине.
    *   getTotalPrice(): number - Возвращает общую стоимость товаров в корзине.
    *   getTotalItems(): number - Возвращает общее количество товаров в корзине.
    *   clearBasket(): void - Очищает корзину. Генерирует событие BASKET_UPDATED.

#### OrderModel

•   **Предназначение:** Управление данными заказа.

•   **Атрибуты:**

    *   paymentMethod: PaymentMethod - Способ оплаты.
    *   address: string - Адрес доставки.
    *   email: string - Email покупателя.
    *   phone: string - Телефон покупателя.
    *   items: string[] - Массив идентификаторов товаров в заказе.

•   **Методы:**

    *   constructor(data: Partial<IOrder>, events: IEvents) - Конструктор класса, принимает данные заказа и объект EventEmitter.
    *   submitOrder(): void - Отправляет заказ.  Генерирует события ORDER_SUBMITTED, ORDER_SUCCESS или ORDER_FAILED.

#### ProductCardView

•   **Предназначение:** Отображение карточки товара в каталоге.

•   **Атрибуты:**

    *   container: HTMLElement - Контейнер, в котором отображается карточка.

•   **Методы:**

    *   render(data: IProduct): HTMLElement - Отрисовывает карточку товара.  Принимает данные товара.  Добавляет обработчики событий на кнопку "В корзину".

#### ProductPreviewView

•   **Предназначение:** Отображение детальной информации о товаре в модальном окне.

•   **Атрибуты:**

    *   container: HTMLElement - Контейнер, в котором отображается информация о товаре.

•   **Методы:**

    *   render(data: IProduct): HTMLElement - Отрисовывает детальную информацию о товаре.  Принимает данные товара.  Добавляет обработчики событий на кнопки "Купить" и "Убрать".

#### BasketView

•   **Предназначение:** Отображение содержимого корзины.

•   **Атрибуты:**

    *   container: HTMLElement - Контейнер, в котором отображается корзина.

•   **Методы:**

    *   render(items: IBasketItem[]): HTMLElement - Отрисовывает содержимое корзины.  Принимает массив товаров в корзине.  Добавляет обработчики событий на кнопки "Удалить".
    *   updateTotalPrice(totalPrice: number): void - Обновляет отображаемую общую стоимость корзины.
    *   updateTotalItems(totalItems: number): void - Обновляет отображаемое общее количество товаров в корзине.

#### OrderFormView

•   **Предназначение:** Отображение формы оформления заказа.

•   **Атрибуты:**

    *   container: HTMLElement - Контейнер, в котором отображается форма.

•   **Методы:**

    *   render(): HTMLElement - Отрисовывает форму оформления заказа.  Добавляет обработчики событий на поля ввода и кнопки.
    *   validate(): IFormValidation -  Проверяет валидность в веденных данных.
    *   getData(): IOrder -  Возвращает данные из формы в виде объекта IOrder.

#### SuccessView

•   **Предназначение:** Отображение сообщения об успешном создании заказа.

•   **Атрибуты:**

    *   container: HTMLElement - Контейнер, в котором отображается сообщение.
    *    total: number - Общая сумма заказа

•   **Методы:**

    *   render(total: number): HTMLElement - Отрисовывает сообщение об успешном заказе. Принимает общую сумму заказа.

### Компоненты и их взаимодействие

•   **Gallery (Каталог товаров):**
    *   Model: ProductModel
    *   View: ProductCardView
    *   Взаимодействие: Presenter получает данные товаров из ProductModel, передает их в ProductCardView для отображения.

•   **Modal (Модальное окно с детальной информацией о товаре):**
    *   Model: ProductModel
    *   View: ProductPreviewView
    *   Взаимодействие: При клике на карточку товара Presenter получает детальную информацию из ProductModel и отображает ее в ProductPreviewView.

•   **Basket (Корзина):**
    *   Model: BasketModel
    *   View: BasketView
    *   Взаимодействие: Presenter получает данные о товарах в корзине из BasketModel и отображает их в BasketView. Обновляет данные в BasketModel при добавлении/удалении товаров.

•   **Order (Оформление заказа):**
    *   Model: OrderModel
    *   View: OrderFormView
    *   Взаимодействие: Presenter получает данные для оформления заказа из OrderModel, отображает форму OrderFormView, обрабатывает отправку заказа.

### Реализация процессов через события

В приложении активно используется брокер событий для обеспечения взаимодействия между компонентами:

•   Добавление товара в корзину: PRODUCT_ADDED_TO_BASKET
•   Удаление товара из корзины: PRODUCT_REMOVED_FROM_BASKET
•   Обновление корзины: BASKET_UPDATED
•   Отправка заказа: ORDER_SUBMITTED
•   Успешное создание заказа: ORDER_SUCCESS
•   Ошибка при создании заказа: ORDER_FAILED
•   Открытие модального окна: MODAL_OPENED
•   Закрытие модального окна: MODAL_CLOSED