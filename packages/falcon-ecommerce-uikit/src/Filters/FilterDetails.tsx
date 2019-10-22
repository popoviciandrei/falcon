import React from 'react';
import { Toggle, Updater } from 'react-powerplug';
import { Details, Summary, themed } from '@deity/falcon-ui';

export const FilterSummary = themed({
  tag: Summary,
  defaultTheme: {
    filterSummary: {
      display: 'flex',
      alignItems: 'center',
      bg: 'transparent',
      m: 'none',
      px: 'none'
    }
  }
});

export const FilterDetails: React.SFC<{
  initiallyOpen?: boolean;
  children: (
    value: {
      on: boolean;
      toggle: (e?: React.MouseEvent<HTMLElement>) => void;
      set: Updater<boolean>;
    }
  ) => React.ReactNode;
}> = ({ initiallyOpen, children, ...rest }) => (
  <Toggle initial={initiallyOpen}>
    {({ on, toggle, ...restToggle }) => (
      <Details
        open={on}
        {...rest}
        defaultTheme={{
          filterDetails: {
            display: 'flex',
            flexDirection: 'column',

            css: (props: any) => ({
              '> :not(summary, style)': {
                display: props.open ? 'block' : 'none',
                flex: props.open ? '1' : 0
              },

              '> summary::-webkit-details-marker': {
                display: 'none'
              },

              '> summary:after': {
                display: 'block',
                content: props.open ? '"-"' : '"+"',
                marginLeft: props.theme.spacing.sm,
                fontSize: props.theme.fontSizes.md,
                lineHeight: 0.6,
                fontWeight: props.theme.fontWeights.bold,
                color: props.theme.colors.primary
              }
            })
          }
        }}
      >
        {children({
          ...restToggle,
          on,
          toggle: e => {
            if (e) {
              e.preventDefault();
            }
            toggle();
          }
        })}
      </Details>
    )}
  </Toggle>
);
FilterDetails.defaultProps = {
  initiallyOpen: false
};
