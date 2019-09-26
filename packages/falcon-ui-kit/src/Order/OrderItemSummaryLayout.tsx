import React from 'react';
import PropTypes from 'prop-types';
import { themed, Box } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const OrderItemSummaryArea = {
  thumb: 'thumb',
  name: 'name',
  price: 'price',
  details: 'details'
};

export type OrderItemSummaryLayoutProps = {
  maxThumbSize: number;
};
export const OrderItemSummaryLayout = themed<OrderItemSummaryLayoutProps, any>({
  tag: Box,
  defaultTheme: {
    orderedItemSummaryLayout: {
      display: 'grid',
      gridGap: 'sm',
      fontSize: 'xs',
      css: ({ maxThumbSize }) => ({
        gridTemplate: toGridTemplate([
          [`${maxThumbSize}px`, '1fr', 'auto'],
          [OrderItemSummaryArea.thumb, OrderItemSummaryArea.name, OrderItemSummaryArea.price],
          [OrderItemSummaryArea.thumb, OrderItemSummaryArea.details, OrderItemSummaryArea.price]
        ])
      })
    }
  }
});
(OrderItemSummaryLayout as any).propTypes = {
  maxThumbSize: PropTypes.number.isRequired
};
