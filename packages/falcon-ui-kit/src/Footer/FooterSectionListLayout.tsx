import { Box, themed } from '@deity/falcon-ui';

export const FooterSectionListLayout = themed({
  tag: Box,
  defaultTheme: {
    footerSectionListLayout: {
      display: 'flex',
      css: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        justifyItems: 'center',
        flexWrap: 'wrap'
      }
    }
  }
});
