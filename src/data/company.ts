export const COMPANY = {
  name: 'ООО «БелорецкДомСервис»',
  short: 'БелорецкДомСервис',
  city: 'Белорецк',
  dispatchPhone: '8 (34792) 3-14-99',
  dispatchPhoneHref: 'tel:+73479231499',
  officePhone: '8 (34792) 3-15-40',
  officePhoneHref: 'tel:+73479231540',
  email: 'domservis.b@mail.ru',
  address: '453500, Республика Башкортостан, г. Белорецк, ул. Ленина, 68',
  inn: '0256000000',
  ogrn: '1120256000000',
} as const;

export const NAV_LINKS = [
  { path: '/', label: 'Главная' },
  { path: '/services', label: 'Услуги' },
  { path: '/about', label: 'О компании' },
  { path: '/disclosure', label: 'Раскрытие' },
  { path: '/request', label: 'Заявки' },
  { path: '/tariffs', label: 'Тарифы' },
  { path: '/contacts', label: 'Контакты' },
] as const;