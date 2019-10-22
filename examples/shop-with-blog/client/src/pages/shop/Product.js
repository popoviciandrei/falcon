import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { T } from '@deity/falcon-i18n';
import { ProductQuery } from '@deity/falcon-shop-data';
import { Box, Text, H1, NumberInput, Button, Icon, FlexLayout } from '@deity/falcon-ui';
import { Field, AddToCartFormProvider } from '@deity/falcon-front-kit';
import {
  ProductLayout,
  ProductLayoutArea,
  ProductDescription,
  ProductPrice,
  ProductTierPrices,
  ProductGallery,
  ProductOptionList,
  Form,
  FormFieldError,
  ErrorSummary,
  PageLayout,
  Breadcrumbs
} from '@deity/falcon-ui-kit';
import { OpenSidebarMutation, SIDEBAR_TYPE } from 'src/components';

const ProductPage = ({ id, path }) => (
  <PageLayout>
    <ProductQuery variables={{ id, path }}>
      {({ data: { product } }) => (
        <React.Fragment>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <Breadcrumbs items={product.breadcrumbs} />
          <OpenSidebarMutation>
            {openSidebar => (
              <AddToCartFormProvider
                quantity={1}
                product={product}
                onSuccess={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.cart } })}
              >
                {({ isSubmitting, status = {} }) => (
                  <ProductLayout as={Form} id="add-to-cart" i18nId="product">
                    <FlexLayout gridArea={ProductLayoutArea.gallery} alignItems="center" justifyContent="center">
                      <ProductGallery items={product.gallery} />
                    </FlexLayout>
                    <Text fontSize="sm" gridArea={ProductLayoutArea.sku}>
                      <T id="product.sku" sku={product.sku} />
                    </Text>
                    <H1 gridArea={ProductLayoutArea.title}>{product.name}</H1>
                    <Box gridArea={ProductLayoutArea.price}>
                      <ProductPrice {...product.price} fontSize="xl" />
                      <ProductTierPrices items={product.tierPrices} />
                    </Box>
                    <ProductOptionList
                      gridArea={ProductLayoutArea.options}
                      name="options"
                      items={product.options}
                      disabled={isSubmitting}
                    />
                    <ProductDescription gridArea={ProductLayoutArea.description} html={product.description} />
                    <FlexLayout alignItems="center" gridArea={ProductLayoutArea.cta} mt="md">
                      <Field name="qty" required>
                        {({ field, label, error }) => (
                          <Box mr="md">
                            <NumberInput {...field} min={1} disabled={isSubmitting} aria-label={label} />
                            <FormFieldError>{field.invalid ? error : null}</FormFieldError>
                          </Box>
                        )}
                      </Field>
                      <Button type="submit" height="xl" disabled={isSubmitting} variant={isSubmitting && 'loader'}>
                        {!isSubmitting && <Icon src="cart" stroke="white" size="md" mr="sm" />}
                        <T id="product.addToCart" />
                      </Button>
                    </FlexLayout>
                    <Box gridArea={ProductLayoutArea.error}>
                      {status.error && <ErrorSummary errors={status.error} />}
                    </Box>
                  </ProductLayout>
                )}
              </AddToCartFormProvider>
            )}
          </OpenSidebarMutation>
        </React.Fragment>
      )}
    </ProductQuery>
  </PageLayout>
);
ProductPage.propTypes = {
  id: PropTypes.string.isRequired
};

export default ProductPage;
