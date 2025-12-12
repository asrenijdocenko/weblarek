# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##### **Данные**
*Интерфейс IProduct*

Описывает поля, необходимые для корректной работы с единицей товара

    - id: string  - идентификатор карточки товара
    - title: string - наименование товара
    - image: string - ссылка на изображение товара
    - category: string - категория, к которой принадлежит товар
    - price: number| null - цена товара
    - description: string - развернутое описание товара

*Интерфейс IBuyer*

Описывает поля необходимые для корректной работы с данными покупателя

    - payment: TPayment - выбор способа оплаты (может принимать значения 'online' | 'offline' | '')
    - address: string - адрес доставки
    - email: string - электронная почта покупателя
    - phone: string - телефон покупателя

###### **Модели данных**

*Класс ProductList*

Отвечает за хранение и управление списком товаров, доступных для покупки, а также за хранение товара, выбранного для детального просмотра.

Конструктор не принимает параметров

Поля:

    - _items: IProduct[] - защищенное поле, в котором хранится массив с карточками продукта

    - _previewItem: IProduct | null - защищенное поле, в котором хранится выбранная карточка для подробного просмотра (если не выбрана - то null)

Методы:

    - saveItems(items: IProduct[]):  - сохраняет массив всех товаров из поля _items

    - getItems(): IProduct[] - возвращает массив всех товаров из поля _items

    - getItem(id: string): IProduct | undefined - возвращает товар по его ID (Если товар не найден, то возвращает undefined)

    - savePreviewItem(item: IProduct): void - сохраняет товар переданный в item в поле _previewItem для подробного просмотра

    - getPreviewItem(): IProduct | null - возвращает товар полученный для подробного просмотра 

*Класс Cart*

Отвечает за сохранение и управление списком товаров, которые сохранены в корзину

Конструктор не принимает параметров

Поля:

    - items: IProduct[] - защищенное поле, которое хранит массив товаров, добавленных в корзину
    
Методы:

    - getItems(): IProduct[] - возвращает массив всех товаров в корзине

    - addItem(item: IProduct): void - добавляет переданный товар item в массив корзины _items

    - removeItem(item: IProduct): void - удаляет переданный товар item из массива корзины _items

    - clearCart(): void - очищает корзину, устанавливая _items в пустой массив

    - getTotalPrice(): number - вычисляет и возвращает общую стоимость всех товаров в корзине. Если цена товара null, она считается как 0

    - getTotalCount(): number - возвращает общее количество товаров в корзине (длину массива _items)

    - checkItemInCart(id: string): boolean - проверяет, находится ли товар с указанным id в корзине. Возвращает true, если товар найден, и false в противном случае

*Класс Buyer*

Отвечает за хранение и валидацию данных связанных с покупателем. Наследуется от EventEmitter для генерации событий при изменении данных.

Конструктор не принимает параметров

Поля:

    - payment: TPayment - защищенное поле, хранит способ оплаты

    - address: string - защищенное поле, хранит адрес доставки

    - email: string - защищенное поле, хранит электронную почту

    - phone: string - защищенное поле, хранит номер телефона

Методы:

    - saveData(data: Partial<IBuyer>): void - сохраняет данные покупателя. Принимает объект типа Partial<IBuyer>, что позволяет обновлять как все поля сразу, так и только некоторые из них, не затрагивая остальные. После сохранения данных вызывает валидацию и эмитит событие 'buyer:changed' с данными и ошибками валидации.

    - getData(): IBuyer - возвращает объект со всеми текущими данными покупателя.

    - clearData(): void - очищает все данные покупателя, устанавливая все поля в пустые строки (payment в ''). После очистки эмитит событие 'buyer:changed'.

    - validateData(): TError - выполняет валидацию всех полей (payment, address, email, phone). Возвращает объект типа TError, в котором ключи - это названия полей, а значения - тексты ошибок. Если поле валидно, оно отсутствует в возвращаемом объекте.

    - validateOrderForm(): TError - выполняет валидацию только полей первой формы оформления заказа (payment и address). Возвращает объект типа TError с ошибками валидации.


###### Слой коммуникации

*Класс ApiClient*

Отвечает за взаимодействие с API сервера, использует композицию, чтобы выполнить запрос на сервер с помощью метода get класса Api и получает с сервера объект с массивом товаров

Конструктор:
    
    Принимает один параметр: api: IApi - объект для выполнения HTTP-запросов

Поля:

    _api: IApi - защищенное поля для хранения экземпляра API

Методы:

    getProductList(): Promise<IProduct[]> - выполняет GET-запрос к эндпоинту /product/, возвращает Promise с массивом товаров

    createOrder(orderData: IOrderData): Promise<TOrderResult> - выполняет POST-запрос к эндпоинту /order/ принимает параметр orderData типа IOrderData - данные заказа возвращает Promise с результатом оформления заказа

###### Классы представления

Все классы представления наследуются от базового класса Component

#### Базовые классы представления

*Абстрактный класс CardBase*

Базовый класс для всех карточек товаров. Содержит общую логику для работы с карточками.

Конструктор:
    `constructor(container: HTMLElement)` - принимает контейнер с клоном темплейта карточки

Поля:
    - `protected abstract templateId: string` - идентификатор темплейта карточки (должен быть определен в дочерних классах)
    - `protected container: HTMLElement` - корневой DOM элемент карточки

Методы:
    - `protected setCategory(element: HTMLElement, category: string): void` - устанавливает категорию товара и соответствующий CSS класс
    - `protected setTitle(element: HTMLElement, title: string): void` - устанавливает название товара
    - `protected setImage(element: HTMLElement, image: string, alt: string): void` - устанавливает изображение товара с обработкой CDN URL
    - `protected setPrice(element: HTMLElement, price: number | null): void` - устанавливает цену товара (если null, отображает "Бесценно")

*Абстрактный класс FormBase<T>*

Базовый класс для всех форм. Содержит общую логику для работы с формами.

Конструктор:
    `constructor(container: HTMLElement)` - принимает контейнер с формой

Поля:
    - `protected formElement: HTMLFormElement | null` - элемент формы
    - `protected submitButton: HTMLButtonElement | null` - кнопка отправки формы
    - `protected errorsElement: HTMLElement | null` - элемент для отображения ошибок
    - `private initialized: boolean` - флаг инициализации формы

Методы:
    - `protected initializeForm(): void` - инициализирует форму, настраивает обработчики событий submit и input
    - `protected abstract handleSubmit(): void` - абстрактный метод для обработки отправки формы (должен быть реализован в дочерних классах)
    - `protected abstract handleInput(): void` - абстрактный метод для обработки ввода в поля формы (должен быть реализован в дочерних классах)
    - `protected setErrors(errors: TError): void` - устанавливает ошибки валидации в элемент отображения ошибок
    - `protected setButtonState(enabled: boolean): void` - устанавливает состояние кнопки отправки (enabled/disabled)

*Класс HeaderCartCounter*

Отвечает за взаимодействие с кнопкой корзины в хедере страницы

Конструктор:

    Принимает один параметр: HeaderData - объект, содержащий информацию о состоянии счетчика товаров в корзине

Поля: 

    counterElement: HTMLElement;
    buttonElement: HTMLButtonElement;

Методы:

    set counter(value: number);

*Класс Galery*

Отвечает за взаимодействие со списком карточек товаров на главной странице

Конструктор:

    Принимает один параметр: GaleryData - объект, содержащий информацию о состоянии элементов содержащихся в каталоге

Поля:

    catalogElement: HTMLElement;

Методы:

    set catalog(item: HTMLEelement[]);


*Класс Modal*

Отвечает за отображение общего интерфейса модального окна.

Конструктор: 
    `constructor(container: HTMLElement)` - принимает контейнер модального окна

Поля:
    - `private closeButton: HTMLButtonElement` - кнопка закрытия модального окна
    - `private contentElement: HTMLElement` - элемент для содержимого модального окна

Методы: 
    - `set content(value: HTMLElement): void` - сеттер для установки содержимого модального окна
    - `open(): void` - открывает модальное окно
    - `close(): void` - закрывает модальное окно и эмитит событие 'modal:close'
    - `render(data?: Partial<ModalData>): HTMLElement` - обновляет содержимое модального окна

*Класс ModalSuccess*

Отвечает за отображение информации в модальном окне успешно выполненного заказа.

Конструктор: 
    `constructor(container: HTMLElement, events: IEvents)` - принимает контейнер и экземпляр EventEmitter

Поля:
    - `private closeButton: HTMLButtonElement` - кнопка закрытия
    - `private totalElement: HTMLElement` - элемент для отображения суммы заказа
    - `private events: IEvents` - экземпляр EventEmitter

Методы: 
    - `set info(data: SuccessData): void` - сеттер для установки информации о заказе
    - `render(data?: Partial<SuccessData>): HTMLElement` - обновляет информацию о заказе

*Класс CardCatalog*

Отвечает за отображение карточки товара в каталоге. Наследуется от CardBase.

Конструктор: 
    `constructor(container: HTMLElement, events: IEvents)` - принимает контейнер с клоном темплейта и EventEmitter

Поля:
    - `protected templateId = 'card-catalog'` - идентификатор темплейта
    - `private events: IEvents` - экземпляр EventEmitter

Методы: 
    - `render(data?: Partial<CardData>): HTMLElement` - обновляет данные карточки товара. При клике на карточку эмитит событие 'card:select' с id товара

*Класс CardBasket*

Отвечает за отображение карточки товара в корзине. Наследуется от CardBase.

Конструктор: 
    `constructor(container: HTMLElement, events: IEvents)` - принимает контейнер с клоном темплейта и EventEmitter

Поля:
    - `protected templateId = 'card-basket'` - идентификатор темплейта
    - `private deleteButton: HTMLButtonElement | null` - кнопка удаления товара
    - `private indexElement: HTMLElement | null` - элемент для отображения номера товара
    - `private events: IEvents` - экземпляр EventEmitter

Методы: 
    - `render(data?: Partial<CardData & { index: number }>): HTMLElement` - обновляет данные карточки товара в корзине. При клике на кнопку удаления эмитит событие 'basket:remove' с id товара

*Класс ModalCardPreview*

Отвечает за отображение модального окна с подробной карточкой товара. Наследуется от CardBase.

Конструктор: 
    `constructor(container: HTMLElement, events: IEvents)` - принимает контейнер с клоном темплейта и EventEmitter

Поля:
    - `protected templateId = 'card-preview'` - идентификатор темплейта
    - `private buttonElement: HTMLButtonElement | null` - кнопка добавления/удаления товара
    - `private isInCart: boolean` - флаг наличия товара в корзине
    - `private events: IEvents` - экземпляр EventEmitter

Методы: 
    - `render(data?: Partial<CardPreviewData>): HTMLElement` - обновляет данные карточки товара. При клике на кнопку эмитит событие 'card:add' или 'card:remove' в зависимости от состояния

*Класс ModalCart*

Отвечает за отображение модального окна с корзиной.

Конструктор: 
    `constructor(container: HTMLElement, events: IEvents)` - принимает контейнер с клоном темплейта и EventEmitter

Поля:
    - `private listElement: HTMLElement` - элемент списка товаров
    - `private totalPriceElement: HTMLElement` - элемент для отображения общей стоимости
    - `private orderButton: HTMLButtonElement` - кнопка оформления заказа
    - `private events: IEvents` - экземпляр EventEmitter

Методы: 
    - `set cart(data: CartData): void` - сеттер для установки данных корзины (массив элементов карточек и общая стоимость)
    - `render(data?: Partial<CartData>): HTMLElement` - обновляет данные корзины

*Класс ModalOrder*

Отвечает за отображение модального окна с формой оформления заказа (первый шаг). Наследуется от FormBase.

Конструктор: 
    `constructor(container: HTMLElement, events: IEvents)` - принимает контейнер с клоном темплейта и EventEmitter

Поля:
    - `private paymentButtons: NodeListOf<HTMLButtonElement>` - кнопки выбора способа оплаты
    - `private addressInput: HTMLInputElement` - поле ввода адреса
    - `private selectedPayment: TPayment` - выбранный способ оплаты
    - `private events: IEvents` - экземпляр EventEmitter

Методы: 
    - `private selectPayment(type: 'card' | 'cash'): void` - обрабатывает выбор способа оплаты, эмитит событие 'order:payment:change'
    - `protected handleSubmit(): void` - обрабатывает отправку формы, эмитит событие 'order:submit' с данными формы
    - `protected handleInput(): void` - обрабатывает ввод в поле адреса, эмитит событие 'order:address:change'
    - `render(data?: Partial<OrderData>): HTMLElement` - обновляет данные формы (payment, address, errors, submitButtonEnabled)

*Класс ModalContacts*

Отвечает за отображение модального окна с формой контактов (второй шаг оформления заказа). Наследуется от FormBase.

Конструктор: 
    `constructor(container: HTMLElement, events: IEvents)` - принимает контейнер с клоном темплейта и EventEmitter

Поля:
    - `private emailInput: HTMLInputElement` - поле ввода email
    - `private phoneInput: HTMLInputElement` - поле ввода телефона
    - `private events: IEvents` - экземпляр EventEmitter

Методы: 
    - `protected handleSubmit(): void` - обрабатывает отправку формы, эмитит событие 'contacts:submit' с данными формы
    - `protected handleInput(): void` - обрабатывает ввод в поля формы, эмитит событие 'contacts:field:change'
    - `render(data?: Partial<ContactsData>): HTMLElement` - обновляет данные формы (email, phone, errors, submitButtonEnabled)


###### Типы данных для классов представления

*HeaderCartCounter*

    `type HeaderData = { counter: number }` - данные для счетчика товаров в корзине

*Galery*

    `type GaleryData = { items: HTMLElement[] }` - данные для галереи (массив HTML элементов карточек товаров)

*Modal*

    `interface ModalData { content: HTMLElement }` - данные для модального окна (содержимое)

*ModalSuccess*

    `interface SuccessData { total: number }` - данные для модального окна успешного заказа (общая сумма)

*CardCatalog*

    `interface CardData { product: IProduct }` - данные для карточки товара (объект товара)

*CardBasket*

    `interface CardData & { index: number }` - данные для карточки товара в корзине (объект товара и его индекс)

*ModalCardPreview*

    `interface CardPreviewData extends CardData { isInCart: boolean }` - данные для карточки товара в превью (объект товара и флаг наличия в корзине)

*ModalCart*

    `interface CartData { items: HTMLElement[]; total: number }` - данные для корзины (массив HTML элементов карточек и общая стоимость)

*ModalOrder*

    `interface OrderData { payment?: TPayment; address?: string; errors?: TError; submitButtonEnabled?: boolean }` - данные для формы заказа

*ModalContacts*

    `interface ContactsData { email?: string; phone?: string; errors?: TError; submitButtonEnabled?: boolean }` - данные для формы контактов

###### Типы данных для событий

*IBuyerChangedEvent*

    `interface IBuyerChangedEvent { data: IBuyer; orderErrors: TError; allErrors: TError }` - данные события изменения данных покупателя. Содержит текущие данные покупателя, ошибки валидации первой формы (orderErrors) и ошибки валидации всех полей (allErrors).

**