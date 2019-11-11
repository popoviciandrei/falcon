import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Customer, Address, Region, Country } from '@deity/falcon-shop-extension';

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
          name
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
    addresses: (Pick<
      Address,
      | 'id'
      | 'firstname'
      | 'lastname'
      | 'telephone'
      | 'street'
      | 'city'
      | 'postcode'
      | 'company'
      | 'defaultBilling'
      | 'defaultShipping'
    > & {
      region: Pick<Region, 'name'>;
      country: Pick<Country, 'id' | 'code'>;
    })[];
  };
};

export class CustomerWithAddressesQuery extends Query<CustomerWithAddressesResponse> {
  static defaultProps = {
    query: GET_CUSTOMER_WITH_ADDRESSES
  };
}
