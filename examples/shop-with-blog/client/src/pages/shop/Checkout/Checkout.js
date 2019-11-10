import React from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Box, H2, H4, Button, Divider } from '@deity/falcon-ui';
import { Checkout, CheckoutProvider } from '@deity/falcon-front-kit';
import { toGridTemplate, Loader, PageLayout, ErrorSummary } from '@deity/falcon-ui-kit';
import { CartQuery, CustomerQuery, GET_CUSTOMER_WITH_ADDRESSES } from '@deity/falcon-shop-data';
import { I18n, T } from '@deity/falcon-i18n';
import { Test3dSecure } from '@deity/falcon-payment-plugin';
import CheckoutCartSummary from './CheckoutCartSummary';
import { EmailSection } from './EmailSection';
import { ShippingAddressSection } from './ShippingAddressSection';
import ShippingMethodSection from './ShippingMethodSection';
import PaymentMethodSection from './PaymentMethodSection';
import AddressSection from './AddressSection';

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
    },
    css: ({ theme }) => ({
      // remove default -/+ icons in summary element
      'details summary:after': {
        display: 'none'
      },
      'details summary:active, details summary:focus': {
        outline: 'none'
      },
      'details summary': {
        paddingRight: theme.spacing.xxl
      },
      'details article': {
        paddingLeft: theme.spacing.xxl,
        paddingRight: theme.spacing.xxl
      },
      '.redirect h4': {
        textAlign: 'center'
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
const computeStepFromValues = (values, errors) => {
  if (!values.email || errors.email) {
    return CheckoutStep.Email;
  }

  if (!values.shippingAddress || errors.shippingAddress) {
    return CheckoutStep.ShippingAddress;
  }

  if (!values.billingAddress || errors.billingAddress) {
    return CheckoutStep.BillingAddress;
  }

  if (!values.shippingMethod || errors.shippingMethod) {
    return CheckoutStep.Shipping;
  }

  if (!values.paymentMethod || errors.paymentMethod) {
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
    if (currentPropsData.loading && !nextProps.checkoutData.loading && !nextProps.checkoutData.error) {
      return changedStep;
    }

    // if step computed from props has changed then use it as new step
    if (nextStepFromProps !== currentStepFromProps) {
      return changedStep;
    }

    return null;
  }

  setCurrentStep = currentStep => this.setState({ currentStep });

  render() {
    const {
      values,
      loading,
      errors,
      result,
      availableShippingMethods,
      availablePaymentMethods,
      setShippingAddress,
      setBillingAddress,
      setBillingSameAsShipping,
      setShippingMethod,
      setPaymentMethod,
      placeOrder
    } = this.props.checkoutData;

    const { customerData, cart } = this.props;

    const addresses = customerData && customerData.addresses ? customerData.addresses : [];
    const defaultShippingAddress = addresses.find(item => item.defaultShipping);
    const defaultBillingAddress = addresses.find(item => item.defaultBilling);

    let orderResult = null;
    if (!loading && result) {
      if (result.url) {
        orderResult = (
          <Box className="redirect">
            <H4 fontSize="md" mb="md">
              <T id="checkout.externalPaymentRedirect" />
            </H4>
            <Test3dSecure {...result} />
          </Box>
        );
      } else if (result.orderId) {
        // order has been placed successfully so we show confirmation
        orderResult = <Redirect to="/checkout/confirmation" />;
      }
    }

    // TODO: observe here if placeOrder were invoked instead!
    if (!loading && !orderResult && cart.itemsQty === 0) {
      return <Redirect to="/" />;
    }

    const { currentStep } = this.state;
    return (
      <I18n>
        {t => (
          <Box position="relative">
            {(loading || result) && <Loader variant="overlay" />}

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
              selectedAddress={values.shippingAddress}
              setAddress={setShippingAddress}
              errors={errors.shippingAddress}
              availableAddresses={addresses}
              defaultSelected={defaultShippingAddress}
            />

            <Divider my="md" />

            <AddressSection
              id="billing-address"
              open={currentStep === CheckoutStep.BillingAddress}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.BillingAddress)}
              title={t('checkout.billingAddress')}
              submitLabel={t('checkout.nextStep')}
              selectedAddress={values.billingAddress}
              setAddress={setBillingAddress}
              setUseTheSame={setBillingSameAsShipping}
              useTheSame={values.billingSameAsShipping}
              labelUseTheSame={t('checkout.useTheSameAddress')}
              availableAddresses={addresses}
              defaultSelected={defaultBillingAddress}
            />

            <Divider my="md" />

            <ShippingMethodSection
              open={currentStep === CheckoutStep.Shipping}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.Shipping)}
              shippingAddress={values.shippingAddress}
              selectedShipping={values.shippingMethod}
              setShippingAddress={setShippingAddress}
              availableShippingMethods={availableShippingMethods}
              setShipping={setShippingMethod}
              errors={errors.shippingMethod}
            />

            <Divider my="md" />

            <PaymentMethodSection
              open={currentStep === CheckoutStep.Payment}
              onEditRequested={() => this.setCurrentStep(CheckoutStep.Payment)}
              selectedPayment={values.paymentMethod}
              availablePaymentMethods={availablePaymentMethods}
              setPayment={setPaymentMethod}
              errors={errors.paymentMethod}
            />

            <Divider my="md" />

            <ErrorSummary errors={errors.order} />

            {currentStep === CheckoutStep.Confirmation && (
              <Button onClick={placeOrder}>
                <T id="checkout.placeOrder" />
              </Button>
            )}

            {orderResult}
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
                    <CustomerQuery query={GET_CUSTOMER_WITH_ADDRESSES}>
                      {({ data: { customer } }) => (
                        <CheckoutWizard checkoutData={checkoutData} customerData={customer} cart={cart} />
                      )}
                    </CustomerQuery>
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
