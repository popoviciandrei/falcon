import {
  Pagination,
  PaginationInput,
  Aggregation,
  SortOrderValue,
  SortOrder,
  OperationInput
} from '@deity/falcon-data';

export type GraphQLBase = {
  __typename?: string;
};

export type ShopConfig = {
  activeCurrency: string;
  activeStore: string;
  currencies: string[];
  baseCurrency: string;
  stores: ShopStoreEntry[];
  timezone: string;
  weightUnit: string;
  sortOrderList: SortOrder[];
} & GraphQLBase;

export type ShopStoreEntry = {
  name: string;
  code: string;
} & GraphQLBase;

export type AddressBase = {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  postcode: string;
  company?: string;
  telephone?: string;
};

export type Address = AddressBase & {
  id: number;
  region?: Region;
  country: Country;
  fax?: string;
  defaultBilling: boolean;
  defaultShipping: boolean;
} & GraphQLBase;

export type CheckoutAddressInput = AddressBase & {
  id?: number;
  regionId?: string;
  countryId: string;
  email?: string;
  saveInAddressBook?: number;
  sameAsBilling?: number;
};

export type AddAddressInput = AddressBase & {
  regionId?: string;
  countryId: string;
  defaultBilling?: boolean;
  defaultShipping?: boolean;
};

export type EditAddressInput = AddressBase & {
  id: number;
  telephone?: string;
  defaultBilling?: boolean;
  defaultShipping?: boolean;
};

export type Customer = {
  id: number;
  websiteId: number;
  addresses: Address[];
  defaultBilling?: string;
  defaultShipping?: string;
  email: string;
  firstname: string;
  lastname: string;
  newsletterSubscriber?: boolean;
} & GraphQLBase;

export type EditCustomerInput = {
  websiteId: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  defaultBilling?: boolean;
  defaultShipping?: boolean;
};

export type RequestPasswordResetInput = {
  email: string;
};

export type ResetCustomerPasswordInput = {
  resetToken: string;
  password: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  password: string;
};

export type ResetPasswordInput = {
  resetToken: string;
  password: string;
};

export type FilterInput = {
  field: string;
  operator: FilterOperator;
  value: string[];
};

export enum FilterOperator {
  /** can bee used also as `inSet`, when array is passed */
  equals = 'eq',
  /** can be used as `notInSet` when array is passed */
  notEquals = 'neq',
  lessThan = 'lt',
  lessThanOrEquals = 'lte',
  greaterThan = 'gt',
  greaterThanOrEquals = 'gte',
  /** in the set */
  inSet = 'in',
  /** not in the set */
  notInSet = 'nin',
  /** in the range */
  range = 'range'
}

export type Cart = {
  active: boolean;
  /** indicates whether products will be shipped or not */
  virtual: boolean;
  items: CartItem[];
  itemsCount: number;
  itemsQty: number;
  totals: CartTotal[];
  /** @deprecated Use ShopConfig.activeCurrency */
  quoteCurrency: string;
  couponCode: string;
  billingAddress: Address;
};

export type CartItem = {
  itemId: number;
  sku: string;
  qty: number;
  name?: string;
  availableQty?: number;
  price?: number;
  productType?: string;
  priceInclTax?: number;
  rowTotal?: number;
  rowTotalInclTax?: number;
  rowTotalWithDiscount?: number;
  taxAmount?: number;
  taxPercent?: number;
  discountAmount?: number;
  discountPercent?: number;
  weeeTaxAmount?: number;
  weeeTaxApplied?: boolean;
  thumbnailUrl?: string;
  urlKey?: string;
  link?: string;
  itemOptions?: CartItemOption[];
} & GraphQLBase;

export type CartItemOption = {
  label: string;
  value: string;
  data: CartItemOptionValue[];
} & GraphQLBase;

export type CartItemOptionValue = {
  qty: string;
  name: string;
  price: string;
} & GraphQLBase;

export type CartTotal = {
  code: string;
  title: string;
  value: number;
} & GraphQLBase;

export type CouponInput = {
  couponCode: string;
};

export type CartItemPayload = {
  itemId: number;
  sku: string;
  qty: number;
  name?: string;
  price: number;
  productType?: string;
} & GraphQLBase;

export type AddToCartInput = {
  sku: string;
  qty: number;
  options?: ProductOptionInput[];
  bundleOptions?: BundleProductOptionInput[];
};

export type ProductOptionInput = {
  id: number;
  value: number;
};

export type BundleProductOptionInput = {
  id: number;
  qty: number;
  selections?: number[];
};

export type RemoveCartItemInput = {
  itemId: number;
};

export type RemoveCartItemPayload = {
  itemId: number;
} & GraphQLBase;

export type UpdateCartItemInput = {
  itemId: number;
  sku: string;
  qty: number;
};

export type ProductListInput = {
  term?: string;
  filters?: FilterInput[];
  sort?: SortOrderValue;
  pagination?: PaginationInput;
};

export type ProductList = {
  items: Product[];
  pagination: Pagination;
};

export type CategoryProductList = {
  items: Product[];
  aggregations: Aggregation[];
  pagination: Pagination;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  image?: string;
  urlPath: string;
  thumbnail?: string;
  price: ProductPrice;
  tierPrices?: ProductTierPrice[];
  currency: string;
  description: string;
  stock: Stock;
  type: string;
  options: ProductOption[];
  bundleOptions: BundleProductOption[];
  gallery: GalleryEntry[];
  seo: ProductSeo;
  breadcrumbs: Breadcrumb[];
};

export type ProductPrice = {
  regular: number;
  special?: number;
  minTier?: number;
};

export type ProductTierPrice = {
  qty: number;
  value: number;
  discount: number;
};

export type Stock = {
  isInStock: boolean;
  qty: number;
};

export type BundleProductOption = {
  id: number;
  position: number;
  productLinks: BundleProductOptionLink[];
  required: boolean;
  sku: string;
  title: string;
  type: string;
};

export type BundleProductOptionLink = {
  canChangeQuantity: number;
  name: string;
  catalogDisplayPrice: string;
  id: string;
  isDefault: boolean;
  optionId: number;
  position: number;
  price: string;
  priceType: string;
  qty: number;
  sku: string;
};

export type GalleryEntry = {
  type: string;
  full: string;
  thumbnail: string;
  embedUrl?: string;
};

export type ProductOption = {
  id: string;
  attributeId: string;
  label?: string;
  position: string;
  productId: string;
  values: ConfigurableProductOptionValue[];
};

export type ConfigurableProductOptionValue = {
  inStock: string;
  label: string;
  valueIndex: string;
};

export type ProductSeo = {
  title: string;
  description: string;
  keywords: string;
};

export type Breadcrumb = {
  name: string;
  urlPath?: string;
};

export type Category = {
  id: string;
  name: string;
  children: Category[];
  description: string;
  breadcrumbs: Breadcrumb[];
  productList: CategoryProductList;
};

export type SignUpInput = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  autoSignIn?: boolean;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type CountryList = {
  items: Country[];
};

export type Country = {
  id?: number;
  code: string;
  englishName?: string;
  localName?: string;
  regions: Region[];
};

export type Region = {
  id?: string;
  code?: string;
  name: string;
};

export type MenuItem = {
  id: string;
  name: string;
  urlPath: string;
  cssClass: string;
  children: MenuItem[];
};

export type Order = {
  id: number;
  referenceNo: string;
  createdAt?: string;
  customerFirstname?: string;
  customerLastname?: string;
  status?: string; // list of possible statuses?
  baseGrandTotal: number;
  subtotal: number;
  grandTotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  orderCurrencyCode?: string;
  items: OrderItem[];
  paymentMethodName?: string;
  billingAddress?: Address;
  shippingDescription?: string;
  shippingAddress?: Address;
  couponCode?: string;
};

export type OrderItem = {
  itemId: string;
  sku: string;
  name: string;
  availableQty: number;
  qty: number;
  price: number;
  productType?: String;
  rowTotalInclTax: number;
  basePrice?: number;
  basePriceInclTax?: number;
  thumbnailUrl?: string;
  urlKey?: string;
  link?: string;
  parentItem?: OrderItem;
};

export type PlaceOrderInput = Partial<
  OperationInput<{
    email?: String;
    billingAddress: CheckoutAddressInput;
    shippingAddress: CheckoutAddressInput;
    paymentMethod: CheckoutDetailsInput;
    shippingMethod: CheckoutDetailsInput;
  }>
>;

export type CheckoutDetailsInput = {
  /** Payment or shipping method name, defined by the backend */
  method: string;
  /** Extra payload data object required by the selected entity (like encrypted credit card info, shipping carrier code etc) */
  data?: object;
};

export type PlaceOrderResult = Order | PlaceOrder3dSecureResult;

export type PlaceOrder3dSecureResult = {
  url: string;
  method: string;
  fields: PlaceOrder3dSecureField[];
};

export type PlaceOrder3dSecureField = {
  name: string;
  value?: string;
};

export type SetCheckoutAddressInput = OperationInput<CheckoutAddressInput>;
export type SetCheckoutDetailsInput = OperationInput<CheckoutDetailsInput>;

export type ShippingMethod = {
  carrierTitle: string;
  carrierCode: string;
  methodCode: string;
  methodTitle: string;
  amount: number;
  priceExclTax: number;
  priceInclTax: number;
  currency?: string;
};

export type PaymentMethod = {
  /** Internal Payment method code (like "paypal_express") */
  code: string;
  /** Translated Payment method title (like "PayPal Express Checkout") */
  title: string;
  /** Configuration object for the specific Payment method */
  config: object;
};
