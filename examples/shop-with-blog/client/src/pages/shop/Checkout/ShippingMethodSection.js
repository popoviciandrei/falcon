import React from 'react';
import PropTypes from 'prop-types';
import { I18n, T } from '@deity/falcon-i18n';
import { ShippingMethodListQuery } from '@deity/falcon-shop-data';
import { SetShippingMethod } from '@deity/falcon-front-kit';
import { Label, FlexLayout, Text, Radio, Box, Button } from '@deity/falcon-ui';
import { ShippingMethodDetails, ErrorSummary } from '@deity/falcon-ui-kit';
import {
  CheckoutSection,
  CheckoutSectionHeader,
  CheckoutSectionFooter,
  CheckoutSectionContentLayout
} from './components';

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
        <Label fontSize="sm" mx="sm" flex="1" htmlFor={`opt-${option.carrierCode}`}>
          <ShippingMethodDetails {...option} />
        </Label>
      </FlexLayout>
    ))}
  </Box>
);
ShippingSelector.propTypes = {
  availableShippingOptions: PropTypes.arrayOf(PropTypes.shape({})),
  onShippingSelected: PropTypes.func
};

export class ShippingMethodSection extends React.Component {
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
              summary={<ShippingMethodDetails {...selectedShipping} />}
            />
          )}
        </I18n>
      );
    } else {
      header = <I18n>{t => <CheckoutSectionHeader title={t('checkout.shipping')} open={open} />}</I18n>;
    }

    return (
      <CheckoutSection open={open}>
        {header}
        {open && (
          <CheckoutSectionContentLayout>
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
                        <CheckoutSectionFooter>
                          <Button
                            disabled={!this.state.selectedShipping}
                            onClick={() => setShipping(this.state.selectedShipping)}
                          >
                            <T id="checkout.nextStep" />
                          </Button>
                          <ErrorSummary errors={error} />
                        </CheckoutSectionFooter>
                      </React.Fragment>
                    )}
                  </SetShippingMethod>
                );
              }}
            </ShippingMethodListQuery>
          </CheckoutSectionContentLayout>
        )}
      </CheckoutSection>
    );
  }
}
ShippingMethodSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // currently selected shipping method
  selectedShipping: PropTypes.shape({})
};
