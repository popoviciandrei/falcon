import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation } from '@deity/falcon-data';
import { GET_IS_AUTHENTICATED } from '../Customer';

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;

export type SignOutResponse = { signOut: boolean };

const defaultOptions = {
  refetchQueries: ['Customer', 'Cart'],
  awaitRefetchQueries: false,
  update: store => {
    const data = store.readQuery({ query: GET_IS_AUTHENTICATED });
    data.customer = undefined;
    store.writeQuery({ query: GET_IS_AUTHENTICATED, data });
  }
};

export class SignOutMutation extends Mutation<SignOutResponse> {
  static defaultProps = {
    mutation: SIGN_OUT,
    ...defaultOptions
  };
}

export const useSignOutMutation = (options: MutationHookOptions<SignOutResponse> = {}) =>
  useMutation(SIGN_OUT, {
    ...defaultOptions,
    ...options
  });
