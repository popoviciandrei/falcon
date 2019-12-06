import React from 'react';
import PropTypes from 'prop-types';
import { FlexLayout, Label, Image, Radio } from '@deity/falcon-ui';
import { SimplePayment } from '@deity/falcon-payment-plugin';
import PayPal from '@deity/falcon-paypal-plugin';
import Adyen from './payments/Adyen';

const paymentPlugins = {
  adyen_cc: Adyen,
  paypal_express: PayPal
};

class PaymentMethodItem extends React.Component {
  renderIcon(code) {
    const icon = code in paymentPlugins && paymentPlugins[code].icon ? paymentPlugins[code].icon : null;

    if (!icon) {
      return null;
    }

    return <Image src={icon} mr="xs" mb="xs" css={{ verticalAlign: 'middle' }} />;
  }

  renderPlugin() {
    const { selectedOption, config, code, onPaymentDetailsReady } = this.props;

    if (!selectedOption || selectedOption !== code) {
      return null;
    }

    const paymentProps = { config, onPaymentDetailsReady };
    switch (selectedOption) {
      case 'adyen_cc':
        return <Adyen {...paymentProps} />;
      case 'paypal_express':
        return <PayPal {...paymentProps} />;
      default:
        // For the rest unmapped payments - return "SimplePayment" plugin
        return <SimplePayment {...paymentProps} />;
    }
  }

  render() {
    const { code, title, selectOption } = this.props;

    return (
      <FlexLayout my="xs" css={{ alignItems: 'center' }}>
        <Radio size="sm" name="payment" id={`opt-${code}`} value={code} onChange={() => selectOption(code)} />
        <Label mx="sm" flex="1" htmlFor={`opt-${code}`}>
          {this.renderIcon(code)}
          {title}
        </Label>
        {this.renderPlugin()}
      </FlexLayout>
    );
  }
}

PaymentMethodItem.propTypes = {
  // Payment code
  code: PropTypes.string.isRequired,
  // Payment title
  title: PropTypes.string.isRequired,
  // Payment config (for plugin)
  config: PropTypes.shape({}),
  // Currently selected payment method
  selectedOption: PropTypes.string,
  // Payment method selector callback
  selectOption: PropTypes.func.isRequired,
  // Payment details ready callback
  onPaymentDetailsReady: PropTypes.func.isRequired
};

PaymentMethodItem.defaultProps = {
  config: {}
};

export default PaymentMethodItem;
