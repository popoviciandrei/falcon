import React from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Box, H2, H4, Button, Divider } from '@deity/falcon-ui';
import { Checkout, CheckoutProvider, PlaceOrder } from '@deity/falcon-front-kit';
import { toGridTemplate, Loader, PageLayout, ErrorSummary } from '@deity/falcon-ui-kit';
import { CartQuery } from '@deity/falcon-shop-data';
import { I18n, T } from '@deity/falcon-i18n';
import { Test3dSecure } from '@deity/falcon-payment-plugin';
import CheckoutCartSummary from './CheckoutCartSummary';
import { EmailSection } from './EmailSection';
import { ShippingAddressSection } from './ShippingAddressSection';
import { BillingAddressSection } from './BillingAddressSection';
import ShippingMethodSection from './ShippingMethodSection';
import PaymentMethodSection from './PaymentMethodSection';

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
        ['1fr'                ],
        [CheckoutArea.checkout],
        [CheckoutArea.divider ],
        [CheckoutArea.cart    ]
      ]),
      md: toGridTemplate([
        ['2fr',                 '1px',                '1fr'            ],
        [CheckoutArea.checkout, CheckoutArea.divider, CheckoutArea.cart]
      ])
    },
    css: ({ theme }) => ({
      // remove default -/+ icons in summary element
      'details summary:after': { display: 'none' },
      'details article': {
        paddingLeft: theme.spacing.xxl,
        paddingRight: theme.spacing.xxl
      }
    })
  }
};

const CheckoutStep = {
  Email: 'EMAIL',
  ShippingAddress: 'SHIPPING_ADDRESS',
  BillingAddress: 'BILLING_ADDRESS',
  Shipping: 'SHIPPING',
  Payment: 'PAYMENT',
  Confirmation: 'CONFIRMATION'
};

// helper that computes step that should be open based on values from CheckoutLogic
const computeStepFromValues = values => {
  if (!values.email) {
    return CheckoutStep.Email;
  }

  if (!values.shippingAddress) {
    return CheckoutStep.ShippingAddress;
  }

  if (!values.billingAddress) {
    return CheckoutStep.BillingAddress;
  }

  if (!values.shippingMethod) {
    return CheckoutStep.Shipping;
  }

  if (!values.paymentMethod) {
    return CheckoutStep.Payment;
  }

  return CheckoutStep.Confirmation;
};

class CheckoutWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: CheckoutStep.Email,
      getCurrentProps: () => this.props // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(nextProps, currentState) {
    const { checkoutData: currentPropsData } = currentState.getCurrentProps();
    const currentStepFromProps = computeStepFromValues(currentPropsData.values, currentPropsData.errors);
    const nextStepFromProps = computeStepFromValues(nextProps.checkoutData.values, nextProps.checkoutData.errors);

    const changedStep = { currentStep: nextStepFromProps };

    // if there's no step set yet then set it correctly
    if (!currentState.currentStep) {
      return changedStep;
    }

    // if loading has finished (changed from true to false) and there's no error then enforce current step
    // to value computed from the next props - this ensures that if user requested edit of particular step
    // then and it has been processed then we want to display step based on actual values from CheckoutLogic
    // if (currentPropsData.loading && !nextProps.checkoutData.loading && !nextProps.checkoutData.error) {
    //   return changedStep;
    // }

    // if step computed from props has changed then use it as new step
    if (nextStepFromProps !== currentStepFromProps) {
      return changedStep;
    }

    return null;
  }

  setCurrentStep = currentStep => this.setState({ currentStep });

  render() {
    const { gridArea, checkoutData } = this.props;
    const { values, isLoading, result } = checkoutData;

    const { currentStep } = this.state;
    return (
      <I18n>
        {t => (
          <Box position="relative" gridArea={gridArea}>
            {isLoading && <Loader variant="overlay" />}

            <EmailSection
              open={currentStep === CheckoutStep.Email}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.Email)}
            />

            <Divider my="md" />

            <ShippingAddressSection
              open={currentStep === CheckoutStep.ShippingAddress}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.ShippingAddress)}
              title={t('checkout.shippingAddress')}
              submitLabel={t('checkout.nextStep')}
            />

            <Divider my="md" />

            <BillingAddressSection
              open={currentStep === CheckoutStep.BillingAddress}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.BillingAddress)}
              title={t('checkout.billingAddress')}
              submitLabel={t('checkout.nextStep')}
            />

            <Divider my="md" />

            <ShippingMethodSection
              open={currentStep === CheckoutStep.Shipping}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.Shipping)}
              shippingAddress={values.shippingAddress}
              selectedShipping={values.shippingMethod}
            />

            <Divider my="md" />

            <PaymentMethodSection
              open={currentStep === CheckoutStep.Payment}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.Payment)}
              selectedPayment={values.paymentMethod}
            />

            <Divider my="md" />

            {currentStep === CheckoutStep.Confirmation && (
              <PlaceOrder>
                {(placeOrder, { error, loading, data }) => {
                  if (!data) {
                    return (
                      <Box>
                        <Button onClick={() => placeOrder(values)} variant={loading && 'loader'}>
                          <T id="checkout.placeOrder" />
                        </Button>
                        <ErrorSummary errors={error} />
                      </Box>
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
        )}
      </I18n>
    );
  }
}

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
                <Checkout>
                  {checkoutData => (
                    <CheckoutWizard checkoutData={{ ...checkoutData }} gridArea={CheckoutArea.checkout} />
                  )}
                </Checkout>
              </CheckoutProvider>
            </Box>
          </Box>
        );
      }}
    </CartQuery>
  </PageLayout>
);

export default CheckoutPage;
