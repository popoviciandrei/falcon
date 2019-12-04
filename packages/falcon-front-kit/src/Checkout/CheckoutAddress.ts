import { ID } from '@deity/falcon-data';
import { AddressBase, Country, Region, CheckoutAddressInput } from '@deity/falcon-shop-extension';

export type CheckoutAddress = AddressBase & {
  id?: ID;
  country: Country;
  region?: Region;
  email?: string;
  saveInAddressBook?: boolean;
};

export const addressToCheckoutAddressInput = (checkoutAddress: CheckoutAddress): CheckoutAddressInput => {
  const { region, country, ...rest } = checkoutAddress;

  return {
    ...rest,
    regionId: region ? region.id : undefined,
    countryId: country.id
  };
};
