import gql from 'graphql-tag';
import { Query } from '../Query';

export type ProductData = {
  id: string;
  sku: string;
  name: string;
  image?: string;
  urlPath: string;
  thumbnail?: string;
  price: ProductPrice;
  tierPrices?: ProductTierPrice[];
  currency: string;
  description: string;
  stock: any; // Stock
  type: string;
  configurableOptions: ConfigurableProductOption[];
  bundleOptions: []; // [BundleProductOption]
  gallery: GalleryEntry[];
  seo: any; // ProductSeo
  breadcrumbs: any;
};

export type ConfigurableProductOption = {
  id: string;
  attributeId: string;
  label?: string;
  position: string;
  productId: string;
  values: ConfigurableProductOptionValue[];
};

export type ConfigurableProductOptionValue = {
  inStock: string;
  label: string;
  valueIndex: string;
};

export type GalleryEntry = {
  type: string;
  full: string;
  thumbnail?: string;
  embedUrl?: string;
};

export type ProductPrice = {
  regular: number;
  special?: number;
  minTier?: number;
};

export type ProductTierPrice = {
  qty: number;
  value: number;
  discount: number;
};

export const GET_PRODUCT = gql`
  query Product($id: String!, $path: String!) {
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
      configurableOptions {
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

export class ProductQuery extends Query<{ product: ProductData }> {
  static defaultProps = {
    query: GET_PRODUCT,
    fetchPolicy: 'cache-and-network'
  };
}
