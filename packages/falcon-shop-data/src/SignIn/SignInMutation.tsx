import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { SignInInput } from '@deity/falcon-shop-extension';

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input)
  }
`;

export type SignInResponse = { signIn: boolean };

export class SignInMutation extends Mutation<SignInResponse, OperationInput<SignInInput>> {
  static defaultProps = {
    mutation: SIGN_IN_MUTATION,
    awaitRefetchQueries: true,
    refetchQueries: ['Cart', 'CustomerWithAddresses', 'Customer']
  };
}
