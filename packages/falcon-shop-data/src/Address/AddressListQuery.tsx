import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Address, AddressCountry, Region } from '@deity/falcon-shop-extension';

export const GET_ADDRESS_LIST = gql`
  query AddressList {
    addressList {
      items {
        id
        firstname
        lastname
        telephone
        street
        city
        postcode
        region {
          id
        }
        country {
          id
          code
          localName
        }
        company
        defaultBilling
        defaultShipping
      }
    }
  }
`;
export type AddressListResponse = {
  addressList: {
    items: (Pick<
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
      country: Pick<AddressCountry, 'id' | 'code' | 'localName'>;
    })[];
  };
};

export class AddressListQuery extends Query<AddressListResponse> {
  static defaultProps = {
    query: GET_ADDRESS_LIST
  };
}
