import { themed, Box } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const OrderListItemArea = {
  id: 'id',
  createdAt: 'createdAt',
  shipTo: 'shipTo',
  grandTotal: 'grandTotal',
  status: 'status',
  actions: 'actions'
};

export const OrderListItemLayout = themed({
  tag: Box,
  defaultTheme: {
    orderListItemLayout: {
      display: 'grid',
      gridGap: {
        sm: 'none',
        md: 'sm'
      },
      py: 'sm',
      borderBottom: 'regular',
      gridTemplate: {
        xs: toGridTemplate([
          ['1fr'],
          [OrderListItemArea.id],
          [OrderListItemArea.createdAt],
          [OrderListItemArea.shipTo],
          [OrderListItemArea.grandTotal],
          [OrderListItemArea.status],
          [OrderListItemArea.actions]
        ]),
        md: toGridTemplate([
          ['1fr', '1fr', '2fr', '1fr', '1fr', '1fr'],
          [
            OrderListItemArea.id,
            OrderListItemArea.createdAt,
            OrderListItemArea.shipTo,
            OrderListItemArea.grandTotal,
            OrderListItemArea.status,
            OrderListItemArea.actions
          ]
        ])
      }
    }
  }
});
