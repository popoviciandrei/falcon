import React from 'react';
import { GridLayout } from '@deity/falcon-ui';
import { ProductOptionRadioGroupField, ProductOption } from './ProductOptionRadioGroupField';

export type ProductOptionListProps = {
  gridArea: string;
  /** form state property name which should be edit */
  name: string;
  items: ProductOption[];
  disabled?: boolean;
};
export const ProductOptionList: React.SFC<ProductOptionListProps> = props => {
  return (
    <GridLayout gridGap="sm" gridArea={props.gridArea}>
      {props.items.map(({ label, attributeId, values }) => (
        <ProductOptionRadioGroupField
          key={attributeId}
          label={label}
          name={`${props.name}.${attributeId}`}
          values={values}
          disabled={props.disabled}
        />
      ))}
    </GridLayout>
  );
};
ProductOptionList.defaultProps = {
  items: []
};
