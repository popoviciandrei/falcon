import { List, ListProps, themed } from '@deity/falcon-ui';

export type FilterItemListLayoutProps = ListProps;
export const FilterItemListLayout = themed({
  tag: List,
  defaultTheme: {
    filterItemListLayout: {
      css: {
        listStyle: 'none'
      }
    }
  }
});
