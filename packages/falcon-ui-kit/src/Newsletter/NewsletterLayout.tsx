import React from 'react';
import { themed, GridLayout } from '@deity/falcon-ui';

export const NewsletterLayout = themed({
  tag: GridLayout,
  defaultProps: {
    css: {
      maxWidth: 560,
      margin: '0 auto',
      justifyItems: 'center'
    }
  }
});
