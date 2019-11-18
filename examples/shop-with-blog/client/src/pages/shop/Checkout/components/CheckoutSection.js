import { Details, themed } from '@deity/falcon-ui';

export const CheckoutSection = themed({
  tag: Details,
  defaultTheme: {
    checkoutSection: {
      pr: 'xxl',
      css: ({ theme }) => ({
        // remove default -/+ icons in summary element
        'details summary:after': { display: 'none' },
        'details article': {
          paddingLeft: theme.spacing.xxl
        }
      })
    }
  }
});
