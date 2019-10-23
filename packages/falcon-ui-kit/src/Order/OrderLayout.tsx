import { themed } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const OrderLayoutArea = {
  status: 'status',
  items: 'items',
  summary: 'summary',
  divider: 'divider'
};

export const OrderLayout = themed({
  tag: 'article',
  defaultTheme: {
    orderLayout: {
      display: 'grid',
      gridGap: 'md',
      // prettier-ignore
      gridTemplate: {
        xs: toGridTemplate([
          ['1fr'],
          [OrderLayoutArea.status ],
          [OrderLayoutArea.items  ],
          [OrderLayoutArea.divider],
          [OrderLayoutArea.summary]
        ]),
        md: toGridTemplate([
          ['2fr',                  '1px',                   '1fr'                  ],
          [OrderLayoutArea.status, OrderLayoutArea.status,  OrderLayoutArea.status ],
          [OrderLayoutArea.items,  OrderLayoutArea.divider, OrderLayoutArea.summary]
        ])
    
      }
    }
  }
});
