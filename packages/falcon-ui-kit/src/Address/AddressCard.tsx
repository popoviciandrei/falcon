import React from 'react';
import { themed, ListItem } from '@deity/falcon-ui';
import { Address } from '@deity/falcon-shop-extension';
import { AddressDetails } from './AddressDetails';

export type AddressCardLayoutProps = Parameters<typeof AddressCardLayout>[0];
export const AddressCardLayout = themed({
  tag: ListItem,
  defaultTheme: {
    addressCardLayout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }
});

export type AddressCardProps = {
  address: Address;
};
export const AddressCard: React.SFC<AddressCardProps> = ({ address }) => (
  <AddressCardLayout>
    <AddressDetails {...address} />
  </AddressCardLayout>
);
