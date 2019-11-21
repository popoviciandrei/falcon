import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useI18n, T } from '@deity/falcon-i18n';
import { PaymentMethodListQuery } from '@deity/falcon-shop-data';
import { TwoStepWizard, SetPaymentMethod, useCheckout } from '@deity/falcon-front-kit';
import { ErrorSummary } from '@deity/falcon-ui-kit';
import { Text, Button } from '@deity/falcon-ui';
import loadable from 'src/components/loadable';
import {
  CheckoutSection,
  CheckoutSectionHeader,
  CheckoutSectionFooter,
  CheckoutSectionContentLayout
} from './components';

// Loading "PaymentMethodItem" component via loadable package
// to avoid premature import of Payment frontend-plugins and their dependencies on SSR
const PaymentMethodItem = loadable(() =>
  import(/* webpackChunkName: "checkout/payment-item" */ './components/PaymentMethodItem')
);

export const PaymentMethodSection = props => {
  const { open, onEditRequested } = props;
  const { t } = useI18n();
  const { values } = useCheckout();
  const [state, setState] = useState(values.paymentMethod || {});

  let header;
  if (!open && values.paymentMethod) {
    header = (
      <CheckoutSectionHeader
        title={t('checkout.payment')}
        onActionClick={onEditRequested}
        editLabel={t('edit')}
        complete
        summary={<Text fontWeight="bold">{values.paymentMethod.title}</Text>}
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
                      <TwoStepWizard initialState={state}>
                        {({ selectedOption, selectOption }) =>
                          paymentMethodList.map(method => (
                            <PaymentMethodItem
                              key={method.code}
                              {...method}
                              selectOption={code => {
                                setState({});
                                selectOption(code);
                              }}
                              selectedOption={selectedOption}
                              onPaymentDetailsReady={data => setState({ ...method, data })}
                            />
                          ))
                        }
                      </TwoStepWizard>
                      <CheckoutSectionFooter>
                        <Button disabled={!state.code} onClick={() => setPayment(state)}>
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
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func
  // callback that sets selected payment method
};
