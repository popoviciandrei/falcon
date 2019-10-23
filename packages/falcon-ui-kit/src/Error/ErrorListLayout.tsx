import { themed, List, ListProps } from '@deity/falcon-ui';

export type ErrorListLayoutProps = ListProps;
export const ErrorListLayout = themed({
  tag: List,
  defaultTheme: {
    errorListLayout: {}
  }
});
