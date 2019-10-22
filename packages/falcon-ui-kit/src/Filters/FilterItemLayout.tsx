import { ListItem, themed } from '@deity/falcon-ui';

export const FilterItemLayout = themed({
  tag: ListItem,
  defaultTheme: {
    filterItemLayout: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      color: 'black',
      pr: 'xs',
      pb: 'xs',
      css: ({ theme }) => ({
        cursor: 'pointer',
        ':hover': {
          color: theme.colors.primaryLight
        }
      })
    }
  }
});
