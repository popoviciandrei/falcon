import React from 'react';
import PropTypes from 'prop-types';
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

const IconInner: React.SFC<PropsWithTheme<IconProps>> = props => {
  const { src, fallback, theme, ...rest } = props;
  const { icons } = theme;

  // TODO: temporary fix for https://github.com/deity-io/falcon/issues/693, remove when resolved
  if (!icons) {
    return null;
  }

  if (icons[src]) {
    const { icon, ...otherProps } = icons[src];

    return <IconRenderer as={icon} {...(otherProps as any)} {...rest} />;
  }

  if (fallback) {
    return fallback;
  }

  if (ENV !== 'production') {
    console.error(
      `There is no icon "${src}" defined in your theme ("theme.icons"), nor has a fallback icon been defined.`
    );
  }

  return null;
};

export const Icon = withTheme(IconInner) as React.SFC<IconProps>;

Icon.propTypes = {
  src: PropTypes.string.isRequired
};
