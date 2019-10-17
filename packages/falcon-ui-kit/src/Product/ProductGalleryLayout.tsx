import { Box, themed } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const productGalleryLayoutArea = {
  full: 'full',
  thumbs: 'thumbs'
};

export const ProductGalleryLayout = themed({
  tag: Box,

  defaultTheme: {
    productGalleryLayout: {
      display: 'grid',
      gridTemplate: {
        // prettier-ignore
        xs: toGridTemplate([
          ['1fr'],
          [productGalleryLayoutArea.full],
          [productGalleryLayoutArea.thumbs]]),
        // prettier-ignore
        md: toGridTemplate([
          ['100px', '1fr'],
          [productGalleryLayoutArea.thumbs, productGalleryLayoutArea.full]])
      }
    }
  }
});
