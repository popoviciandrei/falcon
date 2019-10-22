import React from 'react';
import ReactCreditCardInput from 'react-credit-card-input';
import { Box, Input, PropsWithTheme, withTheme, themed } from '@deity/falcon-ui';
import { I18n } from '@deity/falcon-i18n';

const CreditCardLayout = themed({
  tag: Box,
  defaultTheme: {
    creditCardLayout: {
      css: ({ theme }) => ({
        'label:after': {
          paddingLeft: theme.spacing.sm,
          paddingRight: theme.spacing.sm
        },
        input: {
          fontSize: theme.fontSizes.sm
        }
      })
    }
  }
});

type CreditCardState = {
  number?: string;
  expiry?: string;
  cvc?: string;
  name?: string;
};
export type CreditCardProps = {
  onCompletion: (creditCardInfo: CreditCardState) => void;
} & PropsWithTheme;

class CreditCardInputInner extends React.Component<CreditCardProps, CreditCardState> {
  constructor(props: CreditCardProps) {
    super(props);
    this.state = {
      number: undefined,
      expiry: undefined,
      cvc: undefined,
      name: undefined
    };
  }

  componentDidUpdate(_prevProps: CreditCardProps, prevState: CreditCardState) {
    const { number: prevNumber, expiry: prevExpiry, cvc: prevCvc, name: prevName } = prevState;
    const { number, expiry, cvc, name } = this.state;

    if (
      number &&
      expiry &&
      cvc &&
      name &&
      (prevNumber !== number || prevCvc !== cvc || prevExpiry !== expiry || prevName !== name)
    ) {
      this.props.onCompletion(this.state);
    }
  }

  render() {
    const { theme } = this.props;

    return (
      <I18n>
        {t => (
          <CreditCardLayout>
            <Box my="xs">
              <Input
                my="xs"
                autoComplete="cc-name"
                name="cc-name"
                placeholder={t('creditCard.namePlaceholder')}
                value={this.state.name}
                onChange={({ target: { value: name } }) => {
                  this.setState({ name });
                }}
              />
            </Box>
            <ReactCreditCardInput
              customTextLabels={{
                expiryError: {
                  invalidExpiryDate: t('creditCard.errors.invalidExpiryDate'),
                  monthOutOfRange: t('creditCard.errors.monthOutOfRange'),
                  yearOutOfRange: t('creditCard.errors.yearOutOfRange'),
                  dateOutOfRange: t('creditCard.errors.dateOutOfRange')
                },
                invalidCardNumber: t('creditCard.errors.invalidCardNumber'),
                invalidCvc: t('creditCard.errors.invalidCvc'),
                cardNumberPlaceholder: t('creditCard.numberPlaceholder'),
                expiryPlaceholder: t('creditCard.expiryPlaceholder'),
                cvcPlaceholder: t('creditCard.cvcPlaceholder')
              }}
              fieldStyle={{ border: '1px solid', borderColor: theme.colors.secondaryDark }}
              cardNumberInputRenderer={({ handleCardNumberChange, props }) => (
                <Input {...props} onChange={handleCardNumberChange(e => this.setState({ number: e.target.value }))} />
              )}
              cardExpiryInputRenderer={({ handleCardExpiryChange, props }) => (
                <Input {...props} onChange={handleCardExpiryChange(e => this.setState({ expiry: e.target.value }))} />
              )}
              cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
                <Input {...props} onChange={handleCardCVCChange(e => this.setState({ cvc: e.target.value }))} />
              )}
            />
          </CreditCardLayout>
        )}
      </I18n>
    );
  }
}

export const CreditCardInput = withTheme(CreditCardInputInner);
