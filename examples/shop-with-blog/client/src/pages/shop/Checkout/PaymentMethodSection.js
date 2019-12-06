import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useI18n, T } from '@deity/falcon-i18n';
import { PaymentMethodListQuery } from '@deity/falcon-shop-data';
import { SetPaymentMethod, useCheckout } from '@deity/falcon-front-kit';
import { ErrorSummary } from '@deity/falcon-ui-kit';
import { Text, Button } from '@deity/falcon-ui';
import loadable from 'src/components/loadable';
import {
  CheckoutSection,
  CheckoutSectionHeader,
  CheckoutSectionFooter,
  CheckoutSectionContentLayout
} from './components';

const PaymentMethodPicker = loadable(() =>
  import(/* webpackChunkName: "checkout/payments" */ './components/PaymentMethodPicker')
);

export const PaymentMethodSection = props => {
  const { open, onEditRequested } = props;
  const { t } = useI18n();
  const { values } = useCheckout();
  const [state, setState] = useState(values.paymentMethod || undefined);

  let header;
  if (!open && values.paymentMethod) {
    header = (
      <CheckoutSectionHeader
        title={t('checkout.payment')}
        complete
        summary={<Text fontWeight="bold">{values.paymentMethod.title}</Text>}
        action={
          <Button variant="checkout" onClick={onEditRequested}>
            {t('edit')}
          </Button>
        }
      />
    );
  } else {
    header = <CheckoutSectionHeader title={t('checkout.payment')} open={open} />;
  }

  return (
    <CheckoutSection open={open}>
      {header}
      {open && (
        <CheckoutSectionContentLayout>
          <PaymentMethodListQuery>
            {({ data: { paymentMethodList } }) => {
              if (paymentMethodList.length === 0) {
                return (
                  <Text color="error" mb="sm">
                    <T id="checkout.noPaymentMethodsAvailable" />
                  </Text>
                );
              }

              return (
                <SetPaymentMethod>
                  {(setPayment, { error }) => (
                    <React.Fragment>
                      <PaymentMethodPicker options={paymentMethodList} selected={state} onChange={setState} />
                      <CheckoutSectionFooter>
                        <Button disabled={!state || !state.code} onClick={() => setPayment(state)}>
                          <T id="checkout.nextStep" />
                        </Button>
                        <ErrorSummary errors={error} />
                      </CheckoutSectionFooter>
                    </React.Fragment>
                  )}
                </SetPaymentMethod>
              );
            }}
          </PaymentMethodListQuery>
        </CheckoutSectionContentLayout>
      )}
    </CheckoutSection>
  );
};
PaymentMethodSection.propTypes = {
  open: PropTypes.bool,
  onEditRequested: PropTypes.func
};
