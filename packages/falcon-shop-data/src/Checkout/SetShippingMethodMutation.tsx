import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';
import { SetCheckoutDetailsInput } from '@deity/falcon-shop-extension';

export const SET_SHIPPING_METHOD = gql`
  mutation SetShippingMethod($input: CheckoutDetailsInput!) {
    setShippingMethod(input: $input)
  }
`;

export type SetShippingMethodResponse = {
  setShippingMethod: boolean;
};

export class SetShippingMethodMutation extends Mutation<SetShippingMethodResponse, SetCheckoutDetailsInput> {
  static defaultProps = {
    mutation: SET_SHIPPING_METHOD
  };
}
