import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';

export const GET_CLIENT_CONFIG = gql`
  query ClientConfig($key: String) {
    clientConfig(key: $key) @client
  }
`;

export type ClientConfigVariables = {
  key?: string;
};
export type ClientConfigResponse = {
  [key: string]: any;
};

export class ClientConfigQuery extends Query<ClientConfigResponse, ClientConfigVariables> {
  static defaultProps = {
    query: GET_CLIENT_CONFIG
  };
}
