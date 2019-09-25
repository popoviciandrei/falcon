import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';

const OPEN_SIDEBAR_MUTATION = gql`
  mutation OpenSidebarMutation($contentType: String!, $side: String) {
    openSidebar(contentType: $contentType, side: $side) @client
  }
`;

export class OpenSidebarMutation extends Mutation {
  static defaultProps = {
    mutation: OPEN_SIDEBAR_MUTATION
  };
}
