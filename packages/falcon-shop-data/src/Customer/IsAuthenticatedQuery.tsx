import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Customer } from '@deity/falcon-shop-extension';

export const GET_IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    customer {
      id
    }
  }
`;

export type IsAuthenticatedResponse = {
  customer: Pick<Customer, 'id'>;
};

export class IsAuthenticatedQuery extends Query<IsAuthenticatedResponse> {
  static defaultProps = {
    query: GET_IS_AUTHENTICATED
  };

  static propTypes = {
    ...Query.propTypes
  };
}
