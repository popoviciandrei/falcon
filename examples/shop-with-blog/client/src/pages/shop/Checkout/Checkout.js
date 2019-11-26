import React from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Box, H2, H4, Button, Divider } from '@deity/falcon-ui';
import { CheckoutProvider, useCheckout, PlaceOrder, CheckoutStep } from '@deity/falcon-front-kit';
import { toGridTemplate, Loader, PageLayout, ErrorSummary } from '@deity/falcon-ui-kit';
import { CartQuery } from '@deity/falcon-shop-data';
import { T } from '@deity/falcon-i18n';
import { Test3dSecure } from '@deity/falcon-payment-plugin';
import { CheckoutSectionFooter } from './components';
import { CheckoutCartSummary } from './CheckoutCartSummary';
import { EmailSection } from './EmailSection';
import { ShippingAddressSection } from './ShippingAddressSection';
import { BillingAddressSection } from './BillingAddressSection';
import { ShippingMethodSection } from './ShippingMethodSection';
import { PaymentMethodSection } from './PaymentMethodSection';

const CheckoutArea = {
  checkout: 'checkout',
  cart: 'cart',
  divider: 'divider'
};

const checkoutLayout = {
  checkoutLayout: {
    display: 'grid',
    gridGap: 'lg',
    px: {
      sm: 'none',
      md: 'xxxl'
    },
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr'],
        [CheckoutArea.checkout],
        [CheckoutArea.divider],
        [CheckoutArea.cart]
      ]),
      md: toGridTemplate([
        ['2fr', '1px', '1fr'],
        [CheckoutArea.checkout, CheckoutArea.divider, CheckoutArea.cart]
      ])
    }
  }
};

const CheckoutWizard = () => {
  const { values, isLoading, result, step, setStep } = useCheckout();

  return (
    <Box position="relative">
      {isLoading && <Loader variant="overlay" />}

      <EmailSection open={step === CheckoutStep.Email} onEditRequested={() => setStep(CheckoutStep.Email)} />
      <Divider my="md" />
      <ShippingAddressSection
        open={step === CheckoutStep.ShippingAddress}
        onEditRequested={() => setStep(CheckoutStep.ShippingAddress)}
      />
      <Divider my="md" />
      <BillingAddressSection
        open={step === CheckoutStep.BillingAddress}
        onEditRequested={() => setStep(CheckoutStep.BillingAddress)}
      />
      <Divider my="md" />
      <ShippingMethodSection
        open={step === CheckoutStep.Shipping}
        onEditRequested={() => setStep(CheckoutStep.Shipping)}
      />
      <Divider my="md" />
      <PaymentMethodSection
        open={step === CheckoutStep.Payment}
        onEditRequested={() => setStep(CheckoutStep.Payment)}
      />
      <Divider my="md" />

      {step === CheckoutStep.Confirmation && (
        <PlaceOrder>
          {(placeOrder, { error, loading, data }) => {
            if (!data) {
              return (
                <CheckoutSectionFooter p="xxl">
                  <Button onClick={() => placeOrder(values)} variant={loading && 'loader'}>
                    <T id="checkout.placeOrder" />
                  </Button>
                  <ErrorSummary errors={error} />
                </CheckoutSectionFooter>
              );
            }

            return null;
          }}
        </PlaceOrder>
      )}

      {result && !isLoading && result.url && (
        <Box css={{ textAlign: 'center' }}>
          <H4 fontSize="md" mb="md">
            <T id="checkout.externalPaymentRedirect" />
          </H4>
          <Test3dSecure {...result} />
        </Box>
      )}
      {result && !isLoading && result.orderId && <Redirect to="/checkout/confirmation" />}
    </Box>
  );
};

const CheckoutPage = () => (
  <PageLayout>
    <CartQuery>
      {({ data: { cart } }) => {
        if (cart.itemsQty === 0) {
          return <Redirect to="/" />;
        }

        return (
          <Box defaultTheme={checkoutLayout}>
            <Box gridArea={CheckoutArea.cart}>
              <H2 fontSize="md" mb="md">
                <T id="checkout.summary" />
              </H2>
              <CheckoutCartSummary cart={cart} />
              <Button as={RouterLink} mt="md" to="/cart">
                <T id="checkout.editCart" />
              </Button>
            </Box>
            <Divider gridArea={CheckoutArea.divider} />
            <Box gridArea={CheckoutArea.checkout}>
              <CheckoutProvider>
                <CheckoutWizard />
              </CheckoutProvider>
            </Box>
          </Box>
        );
      }}
    </CartQuery>
  </PageLayout>
);
export default CheckoutPage;
