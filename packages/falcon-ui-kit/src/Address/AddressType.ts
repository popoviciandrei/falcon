import { Address } from '@deity/falcon-shop-extension';

export type AddressType = 'billing' | 'shipping' | 'billing&shipping' | 'other';
export const getAddressType = (address: Address): AddressType =>
  ([address.defaultBilling && 'billing', address.defaultShipping && 'shipping'].filter(x => x).join('&') ||
    'other') as AddressType;
