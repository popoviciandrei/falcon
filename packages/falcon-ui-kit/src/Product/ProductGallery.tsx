import React from 'react';
import { Box, Image, Swipeable, SwipeableItem } from '@deity/falcon-ui';
import { I18n } from '@deity/falcon-i18n';
import { ProductGalleryLayout, productGalleryLayoutArea } from './ProductGalleryLayout';
import { NoProductImagePlaceholder } from './NoProductImagePlaceholder';
import { ProductGalleryThumbLayout } from './ProductGalleryThumbLayout';

export type GalleryItem = {
  full: string;
  thumbnail: string;
};
export type ProductGalleryProps = {
  items: GalleryItem[];
};
type ProductGalleryState = {
  activeElementIndex: number;
};
export class ProductGallery extends React.Component<ProductGalleryProps, ProductGalleryState> {
  scrollableElement: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);

    this.scrollableElement = React.createRef<HTMLDivElement>();
    this.state = {
      activeElementIndex: 0
    };
  }

  scrollToItem = (elementIndex: number) => () => {
    this.setState({ activeElementIndex: elementIndex });

    if (this.scrollableElement.current) {
      this.scrollableElement.current.scrollLeft = elementIndex * this.scrollableElement.current.clientWidth;
    }
  };

  render() {
    const { items } = this.props;

    if (!items.length) {
      return <NoProductImagePlaceholder />;
    }

    if (items.length === 1) {
      return <I18n>{t => <Image src={items[0].full} alt={t('productGallery.imageAlt')} />}</I18n>;
    }

    const { activeElementIndex } = this.state;

    return (
      <ProductGalleryLayout>
        <Box gridArea={productGalleryLayoutArea.thumbs}>
          {items.map((item, index) => (
            <ProductGalleryThumbLayout
              onClick={this.scrollToItem(index)}
              key={item.full}
              variant={index === activeElementIndex && 'selected'}
            >
              <I18n>{t => <Image key={item.thumbnail} src={item.thumbnail} alt={t('productGallery.imageAlt')} />}</I18n>
            </ProductGalleryThumbLayout>
          ))}
        </Box>

        <Swipeable gridArea={productGalleryLayoutArea.full} ref={this.scrollableElement} alignItems="center">
          {items.map(item => (
            <I18n key={item.thumbnail}>
              {t => <SwipeableItem key={item.full} as={Image} src={item.full} alt={t('productGallery.imageAlt')} />}
            </I18n>
          ))}
        </Swipeable>
      </ProductGalleryLayout>
    );
  }
}
