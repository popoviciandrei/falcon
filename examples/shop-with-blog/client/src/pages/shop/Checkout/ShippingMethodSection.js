import React from 'react';
import PropTypes from 'prop-types';
import { I18n, T } from '@deity/falcon-i18n';
import { ShippingMethodListQuery } from '@deity/falcon-shop-data';
import { SetShippingMethod } from '@deity/falcon-front-kit';
import { Label, FlexLayout, DetailsContent, Text, Radio, Box, Button } from '@deity/falcon-ui';
import { Price, ErrorSummary } from '@deity/falcon-ui-kit';
import { CheckoutSection, CheckoutSectionHeader } from './components';

const ShippingSelector = ({ availableShippingOptions = [], onShippingSelected }) => (
  <Box my="md">
    {availableShippingOptions.map(option => (
      <FlexLayout key={option.carrierCode}>
        <Radio
          size="sm"
          id={`opt-${option.carrierCode}`}
          value={option.carrierCode}
          name="shipping"
          onChange={() => onShippingSelected(option)}
        />
        <Label mx="sm" flex="1" htmlFor={`opt-${option.carrierCode}`}>
          {`${option.carrierTitle} (${option.methodTitle}):`}
        </Label>
        <Price value={option.amount} />
      </FlexLayout>
    ))}
  </Box>
);
ShippingSelector.propTypes = {
  availableShippingOptions: PropTypes.arrayOf(PropTypes.shape({})),
  onShippingSelected: PropTypes.func
};

class ShippingSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedShipping: null
    };
  }

  onShippingSelected = selectedShipping => this.setState({ selectedShipping });

  render() {
    const { open, onEditRequested, selectedShipping } = this.props;
    let header;

    if (!open && selectedShipping) {
      header = (
        <I18n>
          {t => (
            <CheckoutSectionHeader
              title={t('checkout.shipping')}
              onActionClick={onEditRequested}
              editLabel={t('edit')}
              complete
              summary={<Text>{selectedShipping.carrierTitle}</Text>}
            />
          )}
        </I18n>
      );
    } else {
      header = <I18n>{t => <CheckoutSectionHeader title={t('checkout.shipping')} />}</I18n>;
    }

    return (
      <CheckoutSection open={open}>
        {header}
        {open && (
          <DetailsContent>
            <ShippingMethodListQuery>
              {({ data: { shippingMethodList } }) => {
                if (shippingMethodList.length === 0) {
                  return (
                    <Text color="error" mb="sm">
                      <T id="checkout.noShippingMethodsAvailable" />
                    </Text>
                  );
                }

                return (
                  <SetShippingMethod>
                    {(setShipping, { error }) => (
                      <React.Fragment>
                        <ShippingSelector
                          availableShippingOptions={shippingMethodList}
                          onShippingSelected={this.onShippingSelected}
                        />
                        <Button
                          disabled={!this.state.selectedShipping}
                          onClick={() => {
                            const { methodCode: method, ...data } = this.state.selectedShipping;
                            setShipping({ method, data });
                          }}
                        >
                          <T id="continue" />
                        </Button>
                        <ErrorSummary errors={error} />
                      </React.Fragment>
                    )}
                  </SetShippingMethod>
                );
              }}
            </ShippingMethodListQuery>
          </DetailsContent>
        )}
      </CheckoutSection>
    );
  }
}
ShippingSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // currently selected shipping method
  selectedShipping: PropTypes.shape({})
};

export default ShippingSection;
