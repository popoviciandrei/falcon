import React from 'react';
import PropTypes from 'prop-types';
import { FlexLayout } from '@deity/falcon-ui';
import AdyenCCPlugin from '@deity/falcon-adyen-plugin';
import { CreditCardInput } from '@deity/falcon-ui-kit';

// TODO: check if it make sense
// const CreditCardInput = loadable(() => import(/* webpackChunkName: "checkout/payment/credit-card" */ './CreditCard'));

const Adyen = ({ config, onPaymentDetailsReady }) => {
  return (
    <AdyenCCPlugin config={config} onPaymentDetailsReady={onPaymentDetailsReady}>
      {({ setCreditCardData }) => (
        <FlexLayout my="md" css={{ width: '100%' }}>
          <CreditCardInput onCompletion={setCreditCardData} />
        </FlexLayout>
      )}
    </AdyenCCPlugin>
  );
};
Adyen.icon = AdyenCCPlugin.icon;
Adyen.propTypes = {
  config: PropTypes.object.isRequired,
  onPaymentDetailsReady: PropTypes.func.isRequired
};

export default Adyen;
