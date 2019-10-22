import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { ChangePasswordInput } from '@deity/falcon-shop-extension';

export const CHANGE_PASSWORD = gql`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export type ChangePasswordResponse = {
  changePassword: boolean;
};

export class ChangePasswordMutation extends Mutation<ChangePasswordResponse, OperationInput<ChangePasswordInput>> {
  static defaultProps = {
    mutation: CHANGE_PASSWORD
  };
}
