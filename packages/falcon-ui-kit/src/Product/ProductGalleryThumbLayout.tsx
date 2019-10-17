import React from 'react';
import { Box, themed } from '@deity/falcon-ui';

export const ProductGalleryThumbLayout = themed({
  tag: Box,
  defaultTheme: {
    productGalleryThumbLayout: {
      border: 'regular',
      borderRadius: 'medium',
      borderColor: 'secondary',
      display: {
        xs: 'inline-flex',
        md: 'block'
      },
      mt: 'md',
      mr: {
        xs: 'sm',
        md: 'none'
      },
      px: 'xs',
      css: {
        cursor: 'pointer',
        height: {
          xs: 70,
          md: 'auto'
        },
        width: {
          xs: 70,
          md: 'auto'
        }
      },

      variants: {
        selected: {
          borderColor: 'primary'
        }
      }
    }
  }
});
