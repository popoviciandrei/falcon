import React from 'react';
import { withTheme } from 'emotion-theming';
import { themed, PropsWithTheme } from '../theme';

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
  if (!props.theme || !props.theme.icons) return null;

  const { icons } = props.theme;
  const { src, fallback, ...rest } = props;

  if (!props.src || !icons[src]) {
    return fallback || null;
  }

  const { icon, ...otherProps } = icons[src];

  return <IconRenderer as={icon} {...(otherProps as any)} {...rest} />;
};

export const Icon = withTheme(IconInner) as React.SFC<IconProps>;
