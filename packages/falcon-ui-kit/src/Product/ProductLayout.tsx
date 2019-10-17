import { themed } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const ProductLayoutArea = {
  gallery: 'gallery',
  sku: 'sku',
  title: 'title',
  description: 'description',
  cta: 'cta',
  price: 'price',
  meta: 'meta',
  empty: 'empty',
  options: 'options',
  error: 'error'
};

export const ProductLayout = themed({
  tag: 'article',
  defaultTheme: {
    productLayout: {
      display: 'grid',
      gridGap: 'sm',

      gridTemplate: {
        // prettier-ignore
        xs: toGridTemplate([
          ['1fr'],
          [ProductLayoutArea.title],
          [ProductLayoutArea.sku],
          [ProductLayoutArea.gallery],
          [ProductLayoutArea.price],
          [ProductLayoutArea.error],
          [ProductLayoutArea.options],
          [ProductLayoutArea.cta],
          [ProductLayoutArea.description],
          [ProductLayoutArea.meta]
        ]),
        // prettier-ignore
        md: toGridTemplate([
          ['1.5fr', '1fr'],
          [ProductLayoutArea.gallery, ProductLayoutArea.sku],
          [ProductLayoutArea.gallery, ProductLayoutArea.title],
          [ProductLayoutArea.gallery, ProductLayoutArea.price],
          [ProductLayoutArea.gallery, ProductLayoutArea.options],
          [ProductLayoutArea.gallery, ProductLayoutArea.cta],
          [ProductLayoutArea.gallery, ProductLayoutArea.error],
          [ProductLayoutArea.gallery, ProductLayoutArea.description, '1fr'],
          [ProductLayoutArea.gallery, ProductLayoutArea.meta]
        ])
      }
    }
  }
});
