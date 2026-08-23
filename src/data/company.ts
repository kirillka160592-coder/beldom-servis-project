export const COMPANY = {
  name: 'ООО «БелорецкДомСервис»',
  short: 'БелорецкДомСервис',
  city: 'Белорецк',
  dispatchPhone: '8 (34792) 3-14-99',
  dispatchPhoneHref: 'tel:+73479231499',
  officePhone: '8 (34792) 3-15-40',
  officePhoneHref: 'tel:+73479231540',
  email: 'info@beldomservis.ru',
  address: '453500, Республика Башкортостан, г. Белорецк, ул. Ленина, 68',
  inn: '0256000000',
  ogrn: '1120256000000',
} as const;

export const NAV_LINKS = [
  { id: 'services', label: 'Услуги' },
  { id: 'about', label: 'О компании' },
  { id: 'disclosure', label: 'Раскрытие' },
  { id: 'request', label: 'Заявки' },
  { id: 'tariffs', label: 'Тарифы' },
  { id: 'contacts', label: 'Контакты' },
] as const;
