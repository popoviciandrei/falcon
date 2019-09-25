import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Box } from '@deity/falcon-ui';
import { OrderListItemArea } from './OrderListItemLayout';
import { OrderListHeaderLayout } from './OrderListHeaderLayout';

export const OrderListHeader = () => (
  <OrderListHeaderLayout>
    <Box gridArea={OrderListItemArea.id}>
      <T id="orderList.idLabel" />
    </Box>
    <Box gridArea={OrderListItemArea.createdAt}>
      <T id="orderList.createdAtLabel" />
    </Box>
    <Box gridArea={OrderListItemArea.shipTo}>
      <T id="orderList.shipToLabel" />
    </Box>
    <Box gridArea={OrderListItemArea.grandTotal}>
      <T id="orderList.grandTotalLabel" />
    </Box>
    <Box gridArea={OrderListItemArea.status}>
      <T id="orderList.statusLabel" />
    </Box>
    <Box gridArea={OrderListItemArea.actions}>
      <T id="orderList.actionsLabel" />
    </Box>
  </OrderListHeaderLayout>
);
