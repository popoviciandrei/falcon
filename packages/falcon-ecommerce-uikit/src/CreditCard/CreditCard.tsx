import React from 'react';
import CreditCardInput from 'react-credit-card-input';
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

export type CreditCardProps = {
  onCompletion: (creditCardInfo: CreditCardState) => void;
} & PropsWithTheme;

export type CreditCardState = {
  number?: string;
  expiry?: string;
  cvc?: string;
  name?: string;
};

type FieldValue = {
  target: {
    value: string;
  };
};

type onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

type InputRenderer = {
  props: object;
  handleCardNumberChange: () => onChangeHandler;
  handleCardExpiryChange: () => onChangeHandler;
  handleCardCVCChange: () => onChangeHandler;
};

class CreditCardClass extends React.Component<CreditCardProps, CreditCardState> {
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
            <CreditCardInput
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
              cardNumberInputProps={{
                value: this.state.number,
                onChange: ({ target: { value: number } }: FieldValue) => {
                  this.setState({ number });
                }
              }}
              cardNumberInputRenderer={({ handleCardNumberChange, props }: InputRenderer) => (
                <Input {...props} onChange={handleCardNumberChange()} />
              )}
              cardExpiryInputProps={{
                value: this.state.expiry,
                onChange: ({ target: { value: expiry } }: FieldValue) => {
                  this.setState({ expiry });
                }
              }}
              cardExpiryInputRenderer={({ handleCardExpiryChange, props }: InputRenderer) => (
                <Input {...props} onChange={handleCardExpiryChange()} />
              )}
              cardCVCInputProps={{
                value: this.state.cvc,
                onChange: ({ target: { value: cvc } }: FieldValue) => {
                  this.setState({ cvc });
                }
              }}
              cardCVCInputRenderer={({ handleCardCVCChange, props }: InputRenderer) => (
                <Input {...props} onChange={handleCardCVCChange()} />
              )}
            />
          </CreditCardLayout>
        )}
      </I18n>
    );
  }
}

export const CreditCard = withTheme(CreditCardClass);
