import { FlexLayout, Details, themed } from '@deity/falcon-ui';

export const CheckoutSection = themed({
  tag: Details,
  defaultTheme: {
    checkoutSection: {
      pr: 'xxl',
      css: {
        // remove default -/+ icons in summary element
        '> summary:after': { display: 'none' }
      }
    }
  }
});

export const CheckoutSectionFooter = themed({
  tag: FlexLayout,
  defaultTheme: {
    checkoutSection: {
      pt: 'sm',
      justifyContent: 'space-between',
      flexDirection: 'row-reverse'
    }
  }
});
