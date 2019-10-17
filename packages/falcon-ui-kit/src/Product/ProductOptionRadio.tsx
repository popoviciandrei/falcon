import React from 'react';
import { themed, Radio } from '@deity/falcon-ui';

export const ProductOptionRadio = themed({
  tag: Radio,
  defaultTheme: {
    productOptionRadio: {
      mr: 'xs',
      css: {
        cursor: 'pointer',
        height: 60,
        width: 60
      }
    }
  }
});
