import gql from 'graphql-tag';
import { Query, OperationInput } from '@deity/falcon-data';
import { ShippingMethodListInput, ShippingMethod } from '@deity/falcon-shop-extension';

export const SHIPPING_METHOD_LIST = gql`
  mutation ShippingMethodList($input: ShippingMethodListInput!) {
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

export class ShippingMethodListQuery extends Query<
  ShippingMethodListResponse,
  OperationInput<ShippingMethodListInput>
> {
  static defaultProps = {
    mutation: SHIPPING_METHOD_LIST
  };
}
