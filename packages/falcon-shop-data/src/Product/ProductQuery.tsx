import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Product as ShopProduct, GalleryEntry, ProductOption } from '@deity/falcon-shop-extension';

export const GET_PRODUCT = gql`
  query Product($id: ID!, $path: String!) {
    product(id: $id) {
      id
      sku
      name
      description
      price {
        regular
        special
        minTier
      }
      tierPrices {
        qty
        value
        discount
      }
      currency
      gallery {
        full
        thumbnail
      }
      options {
        id
        attributeId
        label
        productId
        values {
          valueIndex
          label
          inStock
        }
      }
      seo {
        title
        description
        keywords
      }
      breadcrumbs(path: $path) {
        name
        urlPath
      }
    }
  }
`;

export type Product = Pick<
  ShopProduct,
  'id' | 'sku' | 'name' | 'description' | 'price' | 'tierPrices' | 'currency' | 'seo' | 'breadcrumbs'
> & {
  gallery: Pick<GalleryEntry, 'full' | 'thumbnail'>[];
  options: Pick<ProductOption, 'id' | 'attributeId' | 'label' | 'productId' | 'values'>[];
};
export type ProductResponse = {
  product: Product;
};

export class ProductQuery extends Query<ProductResponse> {
  static defaultProps = {
    query: GET_PRODUCT,
    fetchPolicy: 'cache-and-network'
  };
}
