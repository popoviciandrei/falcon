import React from 'react';
import PropTypes from 'prop-types';
import { T } from '@deity/falcon-i18n';
import { Box, BoxProps, Text } from '@deity/falcon-ui';
import { Locale } from '@deity/falcon-front-kit';

export type ProductTierPricesProps = BoxProps & {
  items: {
    qty: number;
    value: number;
    discount: number;
  }[];
};
export const ProductTierPrices: React.SFC<ProductTierPricesProps> = ({ items: tierPrices, ...rest }) => {
  if (!Array.isArray(tierPrices) || !tierPrices.length) {
    return null;
  }

  return (
    <Box {...rest}>
      <Locale>
        {({ priceFormat }) =>
          tierPrices.map(x => (
            <Text key={x.qty}>
              <T id="product.tierPriceDescription" qty={x.qty} price={priceFormat(x.value)} discount={x.discount} />
            </Text>
          ))
        }
      </Locale>
    </Box>
  );
};
ProductTierPrices.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      qty: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      discount: PropTypes.number.isRequired
    })
  )
};
