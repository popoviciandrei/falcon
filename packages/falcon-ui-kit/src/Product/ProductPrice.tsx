import React from 'react';
import PropTypes from 'prop-types';
import { ThemingProps } from '@deity/falcon-ui';
import { Price } from '../Price';

export type ProductPriceProps = {
  regular: number;
  special?: number;
};
export const ProductPrice: React.SFC<ProductPriceProps & ThemingProps> = ({ regular, special, ...rest }) => {
  return special ? (
    <React.Fragment>
      <Price value={regular} fontSize="md" {...rest} variant="old" mr="xs" />
      <Price value={special} fontSize="md" {...rest} variant="special" />
    </React.Fragment>
  ) : (
    <Price value={regular} fontSize="md" {...rest} />
  );
};
ProductPrice.propTypes = {
  regular: PropTypes.number.isRequired,
  special: PropTypes.number
};
