import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';

export const GET_SIDEBAR_STATE = gql`
  query Sidebar {
    sidebar @client {
      contentType
      side
      isOpen
    }
  }
`;

export class SidebarQuery extends Query {
  static defaultProps = {
    query: GET_SIDEBAR_STATE
  };
}
