import React from 'react';
import { Formik } from 'formik';
import { apolloErrorToErrorModelList } from '@deity/falcon-data';
import { Product, ProductOption } from '@deity/falcon-shop-extension';
import { useAddToCartMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';
import { ProductOptionsMap, productOptionsToForm, formProductOptionsToInput } from './productOptionMappers';

export type AddToCartFormValues = {
  qty: string;
  options: ProductOptionsMap;
  bundleOptions: [];
};
export type AddToCartFormProviderProps = FormProviderProps<AddToCartFormValues> & {
  quantity: number;
  product: Pick<Product, 'sku'> & {
    options?: Pick<ProductOption, 'attributeId'>[];
    bundleOptions?: Pick<Product, 'bundleOptions'>;
  };
};
export const AddToCartFormProvider: React.SFC<AddToCartFormProviderProps> = props => {
  const { onSuccess, initialValues, quantity, product, ...formikProps } = props;
  const defaultInitialValues = {
    qty: quantity,
    options: productOptionsToForm(product.options),
    bundleOptions: product.bundleOptions || []
  };

  const [addToCart] = useAddToCartMutation();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, formikActions) =>
        addToCart({
          variables: {
            input: {
              sku: product.sku,
              qty: parseInt(values.qty.toString(), 10),
              options: formProductOptionsToInput(values.options),
              bundleOptions: undefined // values.bundleOptions as any - TODO: add appropriate mapper
            }
          }
        })
          .then(() => {
            formikActions.setSubmitting(false);
            return onSuccess && onSuccess();
          })
          .catch(e => {
            formikActions.setSubmitting(false);
            formikActions.setStatus({ error: apolloErrorToErrorModelList(e) });
          })
      }
      {...formikProps}
    />
  );
};
