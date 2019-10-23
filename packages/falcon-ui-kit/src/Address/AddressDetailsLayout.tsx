import { Box, themed } from '@deity/falcon-ui';

export type AddressDetailsLayoutProps = Parameters<typeof AddressDetailsLayout>[0];
export const AddressDetailsLayout = themed({
  tag: Box,
  defaultTheme: {
    addressDetailsLayout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      color: 'secondaryText'
    }
  }
});
