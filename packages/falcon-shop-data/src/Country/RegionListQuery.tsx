import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { Region } from '@deity/falcon-shop-extension';

export const GET_REGION_LIST = gql`
  query RegionList {
    regionList {
      items {
        id
        code
        name
      }
    }
  }
`;

export type RegionListResponse = {
  regionList: {
    items: Region[];
  };
};

export class RegionListQuery extends Query<RegionListResponse> {
  static defaultProps = {
    query: GET_REGION_LIST
  };
}
