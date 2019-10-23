import React from 'react';
import { List } from '@deity/falcon-ui';
import { OrderListItem } from './OrderListItem';

export const OrderList = ({ items }) => (
  <List css={{ listStyle: 'none' }}>
    {items.map(x => (
      <OrderListItem key={x.referenceNo} {...x} />
    ))}
  </List>
);
