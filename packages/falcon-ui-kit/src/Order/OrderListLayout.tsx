import React from 'react';
import { themed, Box } from '@deity/falcon-ui';

export const OrderListLayout = themed({
  tag: Box,
  defaultTheme: {
    orderListLayout: {
      display: 'flex',
      flexDirection: 'column'
    }
  }
});
