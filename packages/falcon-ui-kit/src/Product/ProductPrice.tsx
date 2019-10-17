import React from 'react';
import PropTypes from 'prop-types';
import { ThemedComponentProps } from '@deity/falcon-ui';
import { Price } from '../Price';

export type ProductPriceProps = {
  regular: number;
  special?: number;
};
export const ProductPrice: React.SFC<ProductPriceProps & ThemedComponentProps> = ({ regular, special, ...rest }) => {
  return special ? (
    <React.Fragment>
      <Price value={regular} fontSize="md" {...(rest as any)} variant="old" mr="xs" />
      <Price value={special} fontSize="md" {...(rest as any)} variant="special" />
    </React.Fragment>
  ) : (
    <Price value={regular} fontSize="md" {...(rest as any)} />
  );
};
ProductPrice.propTypes = {
  regular: PropTypes.number.isRequired,
  special: PropTypes.number
};
