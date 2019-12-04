import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Customer, Address, Country, Region } from '@deity/falcon-shop-extension';

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
          localName
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
      region: Pick<Region, 'id'>;
      country: Omit<Country, 'englishName'>;
    })[];
  };
};

export class CustomerWithAddressesQuery extends Query<CustomerWithAddressesResponse> {
  static defaultProps = {
    query: GET_CUSTOMER_WITH_ADDRESSES
  };
}
