import React from 'react';
import { Box, themed } from '@deity/falcon-ui';

export const SortOrderPickerLayout = themed({
  tag: Box,
  defaultTheme: {
    sortOrderPickerLayout: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }
});
