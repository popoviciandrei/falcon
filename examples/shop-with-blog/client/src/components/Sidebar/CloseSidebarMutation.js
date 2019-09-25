import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';

const CLOSE_SIDEBAR_MUTATION = gql`
  mutation CloseSidebarMutation {
    closeSidebar @client
  }
`;

export class CloseSidebarMutation extends Mutation {
  static defaultProps = {
    mutation: CLOSE_SIDEBAR_MUTATION
  };
}
