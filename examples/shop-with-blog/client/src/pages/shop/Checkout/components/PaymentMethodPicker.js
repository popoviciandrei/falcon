import React from 'react';
import { TwoStepWizard } from '@deity/falcon-front-kit';
import { Box, Text, FlexLayout, Label, Image, Radio } from '@deity/falcon-ui';
import { SimplePayment } from '@deity/falcon-payment-plugin';
import PayPal from '@deity/falcon-paypal-plugin';
import Adyen from './payments/Adyen';

const paymentCodeToPluginMap = {
  adyen_cc: Adyen,
  paypal_express: PayPal,
  checkmo: SimplePayment
};

const PaymentMethodPicker = ({ options, selected, onChange }) => {
  const isPaymentCodeMapDefined = code => code in paymentCodeToPluginMap;
  const getPaymentPluginFor = code => (isPaymentCodeMapDefined(code) ? paymentCodeToPluginMap[code] : undefined);

  return (
    <TwoStepWizard initialState={selected || {}}>
      {({ selectedOption, selectOption }) => {
        const SelectedPaymentPlugin = (selectedOption && getPaymentPluginFor(selectedOption.code)) || undefined;

        return (
          <React.Fragment>
            <Box>
              {options.map(method => {
                const paymentPlugin = getPaymentPluginFor(method.code);
                if (!paymentPlugin) {
                  if (process.env.NODE_ENV !== 'production') {
                    console.error(`No Payment Method Plugin found for ${method.code}`);
                  }

                  return;
                }

                return (
                  <FlexLayout key={method.code} my="sm" alignItems="center">
                    <Radio
                      id={`opt-${method.code}`}
                      name="payment"
                      value={method.code}
                      checked={method.code === selectedOption.code}
                      onChange={() => selectOption(method)}
                      size="sm"
                    />
                    <Label flex="1" display="flex" alignItems="center" ml="sm" htmlFor={`opt-${method.code}`}>
                      {paymentPlugin.icon && <Image src={paymentPlugin.icon} css={{ verticalAlign: 'middle' }} />}
                      <Text as="span" p="xs">
                        {method.title}
                      </Text>
                    </Label>
                  </FlexLayout>
                );
              })}
            </Box>
            {SelectedPaymentPlugin && (
              <SelectedPaymentPlugin
                config={selectedOption.config}
                onPaymentDetailsReady={details => onChange({ ...selectedOption, data: details })}
              />
            )}
          </React.Fragment>
        );
      }}
    </TwoStepWizard>
  );
};

export default PaymentMethodPicker;
