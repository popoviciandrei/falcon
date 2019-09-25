import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { themed, Box, Text, Link } from '@deity/falcon-ui';
import { OrderListItemLayout, OrderListItemArea, FormattedDate, Price } from '@deity/falcon-ui-kit';

const OrderListItemCellLabel = themed({
  tag: Text,
  defaultTheme: {
    orderListItemCellLabel: {
      display: {
        xs: 'inline-flex',
        md: 'none'
      },
      mr: 'xs',
      css: {
        '::after': {
          content: '":"'
        }
      }
    }
  }
});

export const OrderListItem = props => (
  <OrderListItemLayout>
    <Box gridArea={OrderListItemArea.id} display="flex" alignContent="flex-start">
      <OrderListItemCellLabel>
        <T id="orderList.idLabel" />
      </OrderListItemCellLabel>
      <Link as={RouterLink} to={`/account/orders/${props.id}`}>
        {props.referenceNo}
      </Link>
    </Box>
    <Box gridArea={OrderListItemArea.createdAt} display="flex" alignContent="flex-start">
      <OrderListItemCellLabel>
        <T id="orderList.createdAtLabel" />
      </OrderListItemCellLabel>
      <FormattedDate value={props.createdAt} display="flex" />
    </Box>
    <Box gridArea={OrderListItemArea.shipTo} display="flex" alignContent="flex-start">
      <OrderListItemCellLabel>
        <T id="orderList.shipToLabel" />
      </OrderListItemCellLabel>
      {`${props.customerFirstname} ${props.customerLastname}`}
    </Box>
    <Box gridArea={OrderListItemArea.grandTotal} display="flex" alignContent="flex-start">
      <OrderListItemCellLabel>
        <T id="orderList.grandTotalLabel" />
      </OrderListItemCellLabel>
      <Price value={props.grandTotal} formatOptions={{ currency: props.orderCurrencyCode }} display="flex" />
    </Box>
    <Box gridArea={OrderListItemArea.status} display="flex" alignContent="flex-start">
      <OrderListItemCellLabel>
        <T id="orderList.statusLabel" />
      </OrderListItemCellLabel>
      <T id="order.status" context={props.status || 'na'} />
    </Box>
    <Box gridArea={OrderListItemArea.actions} display="flex" alignContent="flex-start">
      <Link as={RouterLink} to={`/account/orders/${props.id}`}>
        <T id="orderList.viewOrderLink" />
      </Link>
    </Box>
  </OrderListItemLayout>
);
