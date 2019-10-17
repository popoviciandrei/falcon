import React from 'react';
import { themed, Box } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const MiniCartLayoutArea = {
  items: 'items',
  cta: 'cta'
};

export const MiniCartLayout = themed({
  tag: Box,
  defaultTheme: {
    miniCartLayout: {
      display: 'grid',
      gridRowGap: 'md',

      // prettier-ignore
      gridTemplate: toGridTemplate([
        ['1fr'                          ],
        [MiniCartLayoutArea.items, '1fr'],
        [MiniCartLayoutArea.cta         ]
      ]),
      css: {
        width: '100%',
        height: '100%'
      }
    }
  }
});
