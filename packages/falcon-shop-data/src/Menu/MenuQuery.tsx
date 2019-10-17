import gql from 'graphql-tag';
import { MenuItem } from '@deity/falcon-shop-extension';
import { Query } from '@deity/falcon-data';

export const GET_MENU = gql`
  query Menu {
    menu {
      id
      name
      urlPath
      cssClass
      children {
        id
        name
        urlPath
        cssClass
        children {
          id
          name
          urlPath
          cssClass
        }
      }
    }
  }
`;

export type MenuResponse = {
  menu: MenuItem[];
};

export class MenuQuery extends Query<MenuResponse> {
  static defaultProps = {
    query: GET_MENU
  };
}
