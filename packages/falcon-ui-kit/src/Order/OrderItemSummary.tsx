import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Box, Image, Text } from '@deity/falcon-ui';
import { Price } from '../Price';
import { PropertyRowLayout } from '../Layouts';
import { OrderItemSummaryLayout, OrderItemSummaryArea } from './OrderItemSummaryLayout';

export type OrderItemSummaryProps = {
  name: string;
  thumbnailUrl?: string;
  rowTotalInclTax: number;
  qty: number;
};
export const OrderItemSummary: React.SFC<OrderItemSummaryProps> = props => {
  const thumbMaxSize = 80;

  return (
    <OrderItemSummaryLayout maxThumbSize={thumbMaxSize}>
      <Image
        gridArea={OrderItemSummaryArea.thumb}
        src={props.thumbnailUrl}
        css={{ maxWidth: `${thumbMaxSize}px`, maxHeight: `${thumbMaxSize}px` }}
      />
      <Text gridArea={OrderItemSummaryArea.name} fontWeight="bold">
        {props.name}
      </Text>
      <Price
        gridArea={OrderItemSummaryArea.price}
        value={props.rowTotalInclTax}
        fontWeight="bold"
        css={{ textAlign: 'right' }}
      />
      <Box gridArea={OrderItemSummaryArea.details}>
        <PropertyRowLayout>
          <T id="order.quantityLabel" />
          <Text>{props.qty}</Text>
        </PropertyRowLayout>
      </Box>
    </OrderItemSummaryLayout>
  );
};
