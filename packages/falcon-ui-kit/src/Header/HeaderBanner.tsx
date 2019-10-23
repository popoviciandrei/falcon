import { List, themed } from '@deity/falcon-ui';

export const HeaderBanner = themed({
  tag: List,
  defaultTheme: {
    headerBanner: {
      display: 'flex',
      justifyContent: 'flex-end',
      bgFullWidth: 'secondaryLight',
      m: 'none',
      p: 'none',
      css: ({ theme }) => ({
        listStyle: 'none',
        '> li': {
          padding: theme.spacing.xs
        }
      })
    }
  }
});
