import React from 'react';
import { Box, H4 } from '@deity/falcon-ui';
import { Field, requiredValidator } from '@deity/falcon-front-kit';
import { FormFieldError } from '../Forms';
import { ProductOptionRadio } from './ProductOptionRadio';

export type ProductOption = {
  id: string;
  attributeId: string;
  label?: string;
  productId: string;
  values: ProductOptionValue[];
};
export type ProductOptionValue = {
  inStock: string;
  label: string;
  valueIndex: string;
};

export type ProductOptionRadioGroupFieldProps = {
  label?: string;
  name: string;
  values: ProductOptionValue[];
  disabled?: boolean;
};
export const ProductOptionRadioGroupField: React.SFC<ProductOptionRadioGroupFieldProps> = ({
  label,
  name,
  values,
  disabled
}) => (
  <Field name={name} label={label} validate={[requiredValidator]}>
    {({ field, error }) => {
      return (
        <Box>
          {label && <H4 mb="xs">{label}</H4>}
          {values.map(value => (
            <ProductOptionRadio
              {...field}
              id={`${field.id}-${value.valueIndex}`}
              key={value.valueIndex}
              value={value.valueIndex}
              checked={value.valueIndex === field.value}
              disabled={disabled}
              icon={<div>{value.label}</div>}
            />
          ))}
          <FormFieldError>{field.invalid ? error : null}</FormFieldError>
        </Box>
      );
    }}
  </Field>
);
