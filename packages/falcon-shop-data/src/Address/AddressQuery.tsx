import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Address } from '@deity/falcon-shop-extension';

export const GET_ADDRESS = gql`
  query Address($id: ID!) {
    address(id: $id) {
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
      }
      company
      defaultBilling
      defaultShipping
    }
  }
`;

export type AddressResponse = {
  address: Pick<
    Address,
    | 'id'
    | 'firstname'
    | 'lastname'
    | 'telephone'
    | 'street'
    | 'city'
    | 'postcode'
    | 'region'
    | 'country'
    | 'company'
    | 'defaultBilling'
    | 'defaultShipping'
  >[];
};
export class AddressQuery extends Query<AddressResponse> {
  static defaultProps = {
    query: GET_ADDRESS
  };
}
