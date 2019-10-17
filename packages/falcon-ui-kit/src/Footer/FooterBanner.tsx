import { Box, themed } from '@deity/falcon-ui';

export const FooterBanner = themed({
  tag: Box,
  defaultTheme: {
    footerBanner: {
      display: 'grid',
      gridGap: 'sm',
      m: 'none',
      p: 'none',
      color: 'secondaryText',
      bgFullWidth: 'secondary',
      css: {
        textAlign: 'center'
      }
    }
  }
});
