import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Address, Region, Country } from '@deity/falcon-shop-extension';

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
        name
      }
      country {
        id
        code
        regions {
          name
        }
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
    | 'company'
    | 'defaultBilling'
    | 'defaultShipping'
  > & {
    region: Pick<Region, 'name'>;
    country: Pick<Country, 'id' | 'code'> & {
      regions: Pick<Region, 'name'>[];
    };
  };
};
export class AddressQuery extends Query<AddressResponse> {
  static defaultProps = {
    query: GET_ADDRESS
  };
}
