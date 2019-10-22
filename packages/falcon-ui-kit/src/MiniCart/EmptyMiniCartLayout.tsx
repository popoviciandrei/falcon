import { themed, Box } from '@deity/falcon-ui';

export const EmptyMiniCartLayout = themed({
  tag: Box,
  defaultTheme: {
    emptyMiniCartLayout: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      flexDirection: 'column'
    }
  }
});
