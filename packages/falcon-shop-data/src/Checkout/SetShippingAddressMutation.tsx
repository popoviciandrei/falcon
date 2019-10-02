import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';
import { SetCheckoutAddressInput } from '@deity/falcon-shop-extension';

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress($input: CheckoutAddressInput!) {
    setShippingAddress(input: $input)
  }
`;

export type SetShippingAddressResponse = {
  setShippingAddress: boolean;
};

export class SetShippingAddressMutation extends Mutation<SetShippingAddressResponse, SetCheckoutAddressInput> {
  static defaultProps = {
    mutation: SET_SHIPPING_ADDRESS
  };
}
