import React from 'react';
import { Box, themed } from '@deity/falcon-ui';

export const AddressDetailsLayout = themed({
  tag: Box,
  defaultTheme: {
    addressDetailsLayout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      color: 'secondaryText'
    }
  }
});
