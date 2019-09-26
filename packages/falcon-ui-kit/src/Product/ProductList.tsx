import React from 'react';
import PropTypes from 'prop-types';
import { forceCheck } from 'react-lazyload';
import { ListItem } from '@deity/falcon-ui';
import { ProductListLayout } from './ProductListLayout';
import { EmptyProductList } from './EmptyProductList';
import { ProductCard, ProductCardProps } from './ProductCard';

export type ProductListProps = {
  items: ({ id: number } & ProductCardProps)[];
};
export class ProductList extends React.Component<ProductListProps> {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object.isRequired)
  };

  static defaultProps = {
    items: []
  };

  constructor(props: ProductListProps) {
    super(props);

    this.state = {
      getPrevProps: () => this.props
    };
  }

  static getDerivedStateFromProps(nextProps: ProductListProps, prevState: any) {
    const { items: prevItems } = prevState.getPrevProps();
    const { items: nextItems } = nextProps;

    if (prevItems !== nextItems) {
      setTimeout(forceCheck);
    }

    return null;
  }

  render() {
    const { items } = this.props;

    if (!items.length) {
      return <EmptyProductList />;
    }

    return (
      <ProductListLayout>
        {items.map(item => (
          <ListItem key={item.id}>
            <ProductCard {...item} />
          </ListItem>
        ))}
      </ProductListLayout>
    );
  }
}
