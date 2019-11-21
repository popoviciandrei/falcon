import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useI18n, T } from '@deity/falcon-i18n';
import { ShippingMethodListQuery } from '@deity/falcon-shop-data';
import { SetShippingMethod, useCheckout } from '@deity/falcon-front-kit';
import { Label, FlexLayout, Text, Radio, Box, Button } from '@deity/falcon-ui';
import { ShippingMethodDetails, ErrorSummary } from '@deity/falcon-ui-kit';
import {
  CheckoutSection,
  CheckoutSectionHeader,
  CheckoutSectionFooter,
  CheckoutSectionContentLayout
} from './components';

const ShippingSelector = ({ options = [], onSelect }) => (
  <Box my="md">
    {options.map(option => (
      <FlexLayout key={option.carrierCode}>
        <Radio
          size="sm"
          id={`opt-${option.carrierCode}`}
          value={option.carrierCode}
          name="shipping"
          onChange={() => onSelect(option)}
        />
        <Label fontSize="sm" mx="sm" flex="1" htmlFor={`opt-${option.carrierCode}`}>
          <ShippingMethodDetails {...option} />
        </Label>
      </FlexLayout>
    ))}
  </Box>
);
ShippingSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})),
  onSelect: PropTypes.func
};

export const ShippingMethodSection = props => {
  const { open, onEditRequested } = props;
  const { t } = useI18n();
  const { values } = useCheckout();
  const [state, setState] = useState(values.shippingMethod);

  let header;
  if (!open && values.shippingMethod) {
    header = (
      <CheckoutSectionHeader
        title={t('checkout.shipping')}
        onActionClick={onEditRequested}
        editLabel={t('edit')}
        complete
        summary={<ShippingMethodDetails {...values.shippingMethod} />}
      />
    );
  } else {
    header = <CheckoutSectionHeader title={t('checkout.shipping')} open={open} />;
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
                      <ShippingSelector options={shippingMethodList} onSelect={x => setState(x)} />
                      <CheckoutSectionFooter>
                        <Button disabled={!state} onClick={() => setShipping(state)}>
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
};
ShippingMethodSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func
};
