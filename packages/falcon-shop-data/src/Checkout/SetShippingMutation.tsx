import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { SetShippingResult, SetShippingInput } from '@deity/falcon-shop-extension';

export const SET_SHIPPING = gql`
  mutation SetShipping($input: SetShippingInput) {
    setShipping(input: $input) {
      paymentMethods {
        code
        title
        config
      }
    }
  }
`;

export type SetShippingResponse = {
  setShipping: Pick<SetShippingResult, 'paymentMethods'>;
};

export class SetShippingMutation extends Mutation<SetShippingResponse, OperationInput<SetShippingInput>> {
  static defaultProps = {
    mutation: SET_SHIPPING
  };
}
