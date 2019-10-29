import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import { Image, Text, FlexLayout } from '@deity/falcon-ui';
import { ProductPrice, ProductPriceProps } from './ProductPrice';
import { ProductCardLayout } from './ProductCardLayout';

export type ProductCardProps = {
  name: string;
  urlPath: string;
  price: ProductPriceProps;
  thumbnail?: string;
};
export const ProductCard: React.SFC<ProductCardProps> = ({ name, thumbnail, urlPath, price }) => {
  return (
    <ProductCardLayout to={urlPath}>
      {thumbnail && (
        <LazyLoad height="100%" offset={150}>
          <Image css={{ flex: '1 1 100%', minHeight: '0%' }} src={thumbnail} alt={name} />
        </LazyLoad>
      )}
      <Text py="xs" ellipsis>
        {name}
      </Text>
      <FlexLayout>
        <ProductPrice {...price} fontSize="md" />
      </FlexLayout>
    </ProductCardLayout>
  );
};
ProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  urlPath: PropTypes.string.isRequired,
  // @ts-ignore https://github.com/facebook/prop-types/issues/296
  price: PropTypes.shape({
    regular: PropTypes.number.isRequired,
    special: PropTypes.number
  }).isRequired,
  thumbnail: PropTypes.string
};
