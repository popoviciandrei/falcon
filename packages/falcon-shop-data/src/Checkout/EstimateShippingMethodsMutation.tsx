import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { EstimateShippingMethodsInput, ShippingMethod } from '@deity/falcon-shop-extension';

export const ESTIMATE_SHIPPING_METHODS = gql`
  mutation EstimateShippingMethods($input: EstimateShippingMethodsInput!) {
    estimateShippingMethods(input: $input) {
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

export type EstimateShippingMethodsResponse = {
  estimateShippingMethods: ShippingMethod[];
};

export class EstimateShippingMethodsMutation extends Mutation<
  EstimateShippingMethodsResponse,
  OperationInput<EstimateShippingMethodsInput>
> {
  static defaultProps = {
    mutation: ESTIMATE_SHIPPING_METHODS
  };
}
