import React from 'react';
import { themed } from '@deity/falcon-ui';
import { OrderListItemLayout } from './OrderListItemLayout';

export const OrderListHeaderLayout = themed({
  tag: OrderListItemLayout,
  defaultTheme: {
    orderListHeaderLayout: {
      fontWeight: 'bold',
      pb: 'xs',
      display: {
        xs: 'none',
        sm: 'none',
        md: 'grid'
      }
    }
  }
});
