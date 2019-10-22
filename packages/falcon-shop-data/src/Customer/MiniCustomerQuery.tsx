import gql from 'graphql-tag';
import { Customer } from '@deity/falcon-shop-extension';
import { Query } from '@deity/falcon-data';

const GET_MINI_CUSTOMER = gql`
  query MiniCustomer {
    customer {
      id
      firstname
      lastname
      email
    }
  }
`;

export type MiniCustomerResponse = {
  customer: Pick<Customer, 'id' | 'firstname' | 'lastname' | 'email'>;
};

export class MiniCustomerQuery extends Query<MiniCustomerResponse> {
  static defaultProps = {
    query: GET_MINI_CUSTOMER
  };
}
