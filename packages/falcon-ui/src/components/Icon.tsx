import React from 'react';
import { withTheme } from 'emotion-theming';
import { themed, PropsWithTheme } from '../theme';

const ENV = process.env.NODE_ENV;

export type IconRendererProps = Parameters<typeof IconRenderer>[0];
export const IconRenderer = themed({
  tag: 'svg',

  defaultProps: {
    // https://stackoverflow.com/questions/18646111/disable-onfocus-event-for-svg-element
    focusable: 'false'
  },

  defaultTheme: {
    icon: {
      size: 'lg',
      stroke: 'primary'
    }
  }
});

export type IconProps = IconRendererProps & {
  src: string;
  fallback?: any;
};

const IconInner: React.SFC<IconProps & PropsWithTheme> = props => {
  const { src, fallback, theme, ...rest } = props;
  const { icons } = theme;
if(!icons) {
    return null;
}
  if (!src || !icons || !icons[src]) {
    if (ENV !== 'production') {
      const errorMessage = `No icon with the name "${src}" was found in your theme.`;
      console.error(errorMessage);
    }
    return fallback || null;
  }

  const { icon, ...otherProps } = icons[src];

  return <IconRenderer as={icon} {...(otherProps as any)} {...rest} />;
};

export const Icon = withTheme(IconInner) as React.SFC<IconProps>;
