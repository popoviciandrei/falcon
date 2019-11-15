import React from 'react';
import PropTypes from 'prop-types';
import { I18n, T } from '@deity/falcon-i18n';
import { ShippingMethodListQuery } from '@deity/falcon-shop-data';
import { SetShippingMethod } from '@deity/falcon-front-kit';
import { Label, FlexLayout, Details, DetailsContent, Text, Radio, Box, Button } from '@deity/falcon-ui';
import { Price, ErrorSummary } from '@deity/falcon-ui-kit';
import SectionHeader from './CheckoutSectionHeader';

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
    const { open, onEditRequested, selectedShipping, errors } = this.props;
    let header;

    if (!open && selectedShipping) {
      header = (
        <I18n>
          {t => (
            <SectionHeader
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
      header = <I18n>{t => <SectionHeader title={t('checkout.shipping')} />}</I18n>;
    }

    return (
      <Details open={open}>
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
                    {setShipping => (
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
                        <ErrorSummary errors={errors} />
                      </React.Fragment>
                    )}
                  </SetShippingMethod>
                );
              }}
            </ShippingMethodListQuery>
          </DetailsContent>
        )}
      </Details>
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
