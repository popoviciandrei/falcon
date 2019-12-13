import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { SignInInput, Customer } from '@deity/falcon-shop-extension';
import { GET_IS_AUTHENTICATED } from '../Customer';

export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      id
    }
  }
`;

export type SignInResponse = { signIn: Pick<Customer, 'id'> };

const defaultOptions = {
  refetchQueries: ['Cart', 'Customer'],
  awaitRefetchQueries: false,
  update: (store, { data: { signIn: customer } }) => {
    const data = store.readQuery({ query: GET_IS_AUTHENTICATED });
    data.customer = customer;
    store.writeQuery({ query: GET_IS_AUTHENTICATED, data: { ...data } });
  }
};

export class SignInMutation extends Mutation<SignInResponse, OperationInput<SignInInput>> {
  static defaultProps = {
    mutation: SIGN_IN,
    ...defaultOptions
  };
}

export const useSignInMutation = (options: MutationHookOptions<SignInResponse, OperationInput<SignInInput>> = {}) =>
  useMutation(SIGN_IN, {
    ...defaultOptions,
    ...options
  });
