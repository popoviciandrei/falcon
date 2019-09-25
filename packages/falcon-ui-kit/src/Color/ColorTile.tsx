import React from 'react';
import { Box, themed } from '@deity/falcon-ui';

export type ColorTileProps = {
  color: string;
};

export const ColorTile = themed<ColorTileProps, any>({
  tag: Box,
  defaultProps: {
    color: 'black'
  },
  defaultTheme: {
    colorTile: {
      size: 'md',
      borderRadius: 'small',
      border: 'bold',
      borderColor: 'secondaryDark',
      css: ({ color }) => ({
        backgroundColor: color
      })
    }
  }
});
