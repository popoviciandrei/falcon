import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Text } from '@deity/falcon-ui';
import { PropertyRowLayout, Price } from '@deity/falcon-ui-kit';

const TOTALS = {
  SHIPPING: 'shipping',
  SUBTOTAL: 'subtotal',
  GRAND_TOTAL: 'grand_total',
  DISCOUNT: 'discount'
};

// helper that returns particular total by its code
const getTotalByCode = (totals, code) => totals.find(total => total.code === code);

const CartTotals = ({ totalsData, totalsToDisplay = [], bold = [], ...props }) => (
  <Box {...props}>
    {totalsToDisplay.map((code, index) => {
      if (code === 'divider') {
        return <Divider key={`divider-${index}`} />; // eslint-disable-line react/no-array-index-key
      }

      const total = getTotalByCode(totalsData, code);
      if (total) {
        return (
          <PropertyRowLayout
            key={code}
            variant="spaceBetween"
            fontWeight={bold.indexOf(code) !== -1 ? 'bold' : 'normal'}
          >
            <Text>{total.title}</Text>
            <Price value={total.value} />
          </PropertyRowLayout>
        );
      }

      return null;
    })}
  </Box>
);

CartTotals.propTypes = {
  totalsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.number
    })
  ),
  totalsToDisplay: PropTypes.arrayOf(PropTypes.string),
  bold: PropTypes.arrayOf(PropTypes.string)
};

CartTotals.TOTALS = TOTALS;

export default CartTotals;
