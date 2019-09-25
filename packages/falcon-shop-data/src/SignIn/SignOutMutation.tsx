import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';

export const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut
  }
`;

export type SignOutResponse = { signOut: boolean };

export class SignOutMutation extends Mutation<SignOutResponse> {
  static defaultProps = {
    mutation: SIGN_OUT_MUTATION,
    refetchQueries: ['Customer', 'Cart']
  };
}
