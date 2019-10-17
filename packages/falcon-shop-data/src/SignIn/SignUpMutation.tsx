import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { SignUpInput } from '@deity/falcon-shop-extension';

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input)
  }
`;

export type SignUpResponse = { signUp: boolean };

export class SignUpMutation extends Mutation<SignUpResponse, OperationInput<SignUpInput>> {
  static defaultProps = {
    mutation: SIGN_UP_MUTATION,
    refetchQueries: ['Customer', 'Cart']
  };
}
