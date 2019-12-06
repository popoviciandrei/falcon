import React from 'react';
import PropTypes from 'prop-types';
import { Text, FlexLayout } from '@deity/falcon-ui';
import { Price } from '../Price';

export type ShippingMethodDetailsProps = {
  carrierTitle: string;
  methodTitle?: string;
  amount: number;
};
export const ShippingMethodDetails: React.SFC<ShippingMethodDetailsProps> = ({ carrierTitle, methodTitle, amount }) => (
  <FlexLayout justifyContent="space-between">
    <FlexLayout>
      <Text fontWeight="bold">{`${carrierTitle}`}</Text>
      {methodTitle && <Text pl="xs" color="secondaryText">{`(${methodTitle})`}</Text>}
    </FlexLayout>
    <Price value={amount} />
  </FlexLayout>
);
ShippingMethodDetails.propTypes = {
  carrierTitle: PropTypes.string.isRequired,
  methodTitle: PropTypes.string,
  amount: PropTypes.number.isRequired
};
