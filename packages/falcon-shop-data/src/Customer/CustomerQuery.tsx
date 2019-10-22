import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Customer } from '@deity/falcon-shop-extension';

export const GET_CUSTOMER = gql`
  query Customer {
    customer {
      id
      firstname
      lastname
      email
      websiteId
    }
  }
`;

export type CustomerResponse = {
  customer: Pick<Customer, 'id' | 'firstname' | 'lastname' | 'email' | 'websiteId'>;
};

export class CustomerQuery extends Query<CustomerResponse> {
  static defaultProps = {
    query: GET_CUSTOMER
  };

  static propTypes = {
    ...Query.propTypes
  };
}
