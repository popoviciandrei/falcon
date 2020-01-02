import gql from 'graphql-tag';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { Customer, EditCustomerInput } from '@deity/falcon-shop-extension';

export const EDIT_CUSTOMER = gql`
  mutation EditCustomer($input: EditCustomerInput!) {
    editCustomer(input: $input) {
      id
    }
  }
`;

export type EditCustomerResponse = {
  editCustomer: Pick<Customer, 'id'>;
};

export class EditCustomerMutation extends Mutation<EditCustomerResponse, OperationInput<EditCustomerInput>> {
  static defaultProps = {
    mutation: EDIT_CUSTOMER,
    refetchQueries: ['Customer', 'CustomerWithAddresses'],
    awaitRefetchQueries: true
  };
}

export const useEditCustomerMutation = (
  options: MutationHookOptions<EditCustomerResponse, OperationInput<EditCustomerInput>> = {}
) =>
  useMutation(EDIT_CUSTOMER, {
    refetchQueries: ['Customer', 'CustomerWithAddresses'],
    awaitRefetchQueries: true,
    ...options
  });
