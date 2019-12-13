import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { Product, ProductOption } from '@deity/falcon-shop-extension';
import { useAddToCartMutation, AddToCartResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';
import { ProductOptionsMap, productOptionsToForm, formProductOptionsToInput } from './productOptionMappers';

export type AddToCartFormValues = {
  qty: string;
  options: ProductOptionsMap;
  bundleOptions: [];
};
export type AddToCartFormProviderProps = FormProviderProps<AddToCartFormValues, AddToCartResponse> & {
  quantity: number;
  product: Pick<Product, 'sku'> & {
    options?: Pick<ProductOption, 'attributeId'>[];
    bundleOptions?: Pick<Product, 'bundleOptions'>;
  };
};
export const AddToCartFormProvider: React.SFC<AddToCartFormProviderProps> = props => {
  const { onSuccess, initialValues, quantity, product, mutationOptions, ...formikProps } = props;
  const defaultInitialValues = {
    qty: quantity,
    options: productOptionsToForm(product.options),
    bundleOptions: product.bundleOptions || []
  };

  const [addToCart] = useAddToCartMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        addToCart({
          variables: {
            input: {
              sku: product.sku,
              qty: parseInt(values.qty.toString(), 10),
              options: formProductOptionsToInput(values.options),
              bundleOptions: undefined // values.bundleOptions as any - TODO: add appropriate mapper
            }
          },
          ...(mutationOptions || {})
        })
          .then(({ data }) => {
            setSubmitting(false);
            setStatus({ data });
            return onSuccess && onSuccess(data);
          })
          .catch(e => {
            const error = getUserError(e);
            if (error.length) {
              setStatus({ error });
              setSubmitting(false);
            }
          })
      }
      {...formikProps}
    />
  );
};
