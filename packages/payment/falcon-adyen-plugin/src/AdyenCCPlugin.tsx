import React from 'react';
// eslint-disable-next-line import/order
import { PaymentPluginModel, PaymentPluginComponentProps } from '@deity/falcon-payment-plugin';

const adyen = require('adyen-cse-web');

export type AdyenProps = PaymentPluginComponentProps & {
  config: {
    key: string;
  };
  children: (args: any) => React.ReactNode;
};

export interface CreditCardData {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export class AdyenCCPlugin extends PaymentPluginModel<AdyenProps> {
  static icon: string =
    'https://raw.githubusercontent.com/Adyen/adyen-magento2/develop/view/base/web/images/logos/creditcard.png';

  private cseInstance: any;

  constructor(props: AdyenProps) {
    super(props);

    const { key } = this.props.config;
    this.cseInstance = adyen.createEncryption(key, {});
  }

  encryptCreditCard({ number, expiry, cvc, name }: CreditCardData) {
    const expiryMonth = expiry.split('/')[0].trim();
    let expiryYear = expiry.split('/')[1].trim();
    if (expiryYear.length === 2) {
      // Adding `20xx` prefix for 2-digit year
      expiryYear = `20${expiryYear}`;
    }

    const creditCard = {
      holderName: name,
      number: number.replace(/ /g, ''),
      cvc,
      expiryMonth,
      expiryYear,
      generationtime: new Date().toISOString()
    };
    const encryptedData = this.cseInstance.encrypt(creditCard);
    if (encryptedData) {
      this.props.onPaymentDetailsReady({
        cc_type: '',
        encrypted_data: encryptedData,
        store_cc: false
      });
    }
  }

  setCreditCardData = (data: CreditCardData) => {
    this.encryptCreditCard(data);
  };

  render() {
    return this.props.children({
      setCreditCardData: this.setCreditCardData
    });
  }
}
