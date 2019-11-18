import { toGridTemplate } from '@deity/falcon-ui-kit';

export const CheckoutSectionHeaderLayoutArea = {
  icon: 'icon',
  title: 'title',
  summary: 'summary',
  button: 'button'
};

export const CheckoutSectionHeaderLayout = {
  checkoutSectionHeaderLayout: {
    lineHeight: 1,
    display: 'grid',
    gridGap: 'sm',
    // prettier-ignore
    gridTemplate: toGridTemplate([
      ['40px', '2fr', '3fr', '100px'],
      [CheckoutSectionHeaderLayoutArea.icon, CheckoutSectionHeaderLayoutArea.title, CheckoutSectionHeaderLayoutArea.summary, CheckoutSectionHeaderLayoutArea.button]
    ])
  }
};
