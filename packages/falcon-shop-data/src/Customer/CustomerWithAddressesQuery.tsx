import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Customer, Address } from '@deity/falcon-shop-extension';

export const GET_CUSTOMER_WITH_ADDRESSES = gql`
  query CustomerWithAddresses {
    customer {
      id
      firstname
      lastname
      email
      addresses {
        id
        company
        firstname
        lastname
        street
        postcode
        city
        region {
          id
        }
        country {
          id
          code
        }
        defaultBilling
        defaultShipping
        telephone
      }
    }
  }
`;

export type CustomerWithAddressesResponse = {
  customer: Pick<Customer, 'id' | 'firstname' | 'lastname' | 'email'> & {
    addresses: Pick<
      Address,
      | 'id'
      | 'company'
      | 'firstname'
      | 'lastname'
      | 'street'
      | 'postcode'
      | 'city'
      | 'country'
      | 'defaultBilling'
      | 'defaultShipping'
      | 'region'
      | 'telephone'
    >[];
  };
};

export class CustomerWithAddressesQuery extends Query<CustomerWithAddressesResponse> {
  static defaultProps = {
    query: GET_CUSTOMER_WITH_ADDRESSES
  };
}
