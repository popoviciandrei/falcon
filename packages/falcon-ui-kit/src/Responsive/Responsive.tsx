import React from 'react';
import MediaQuery from 'react-responsive';
import { withTheme, PropsWithTheme, ThemeBreakpoints } from '@deity/falcon-ui';

export type ResponsiveProps = {
  width?: keyof ThemeBreakpoints | number;
  height?: keyof ThemeBreakpoints | number;
  children: React.ReactNode;
};
const ResponsiveInner: React.SFC<PropsWithTheme<ResponsiveProps>> = props => {
  const { theme, width, height, ...rest } = props;

  let responsiveProps = {};

  if (width !== undefined) {
    responsiveProps = {
      ...responsiveProps,
      minWidth: theme.breakpoints[width] || width
    };
  }

  if (height !== undefined) {
    responsiveProps = {
      ...responsiveProps,
      minHeight: theme.breakpoints[height] || height
    };
  }

  return <MediaQuery {...responsiveProps} {...rest} />;
};

export const Responsive: React.SFC<ResponsiveProps> = withTheme(ResponsiveInner) as React.SFC<ResponsiveProps>;
