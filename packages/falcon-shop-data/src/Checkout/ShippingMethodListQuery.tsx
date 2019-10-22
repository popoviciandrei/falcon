import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { useQuery, useLazyQuery, LazyQueryHookOptions, QueryHookOptions } from '@apollo/react-hooks';
import { ShippingMethod } from '@deity/falcon-shop-extension';

export const SHIPPING_METHOD_LIST = gql`
  query ShippingMethodList {
    shippingMethodList {
      carrierTitle
      carrierCode
      methodCode
      methodTitle
      amount
      priceExclTax
      priceInclTax
      currency
    }
  }
`;

export type ShippingMethodListResponse = {
  shippingMethodList: ShippingMethod[];
};

export class ShippingMethodListQuery extends Query<ShippingMethodListResponse> {
  static defaultProps = {
    query: SHIPPING_METHOD_LIST
  };
}

export const useShippingMethodListQuery = (options?: QueryHookOptions<ShippingMethodListResponse>) =>
  useQuery<ShippingMethodListResponse>(SHIPPING_METHOD_LIST, options);

export const useShippingMethodListLazyQuery = (options?: LazyQueryHookOptions<ShippingMethodListResponse>) =>
  useLazyQuery<ShippingMethodListResponse>(SHIPPING_METHOD_LIST, options);
