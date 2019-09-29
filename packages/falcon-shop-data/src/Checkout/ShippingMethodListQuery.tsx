import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { ShippingMethodListInput, ShippingMethod } from '@deity/falcon-shop-extension';

export const SHIPPING_METHOD_LIST = gql`
  query ShippingMethodList($input: ShippingMethodListInput!) {
    shippingMethodList(input: $input) {
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

export class ShippingMethodListQuery extends Query<ShippingMethodListResponse, ShippingMethodListInput> {
  static defaultProps = {
    query: SHIPPING_METHOD_LIST
  };
}
