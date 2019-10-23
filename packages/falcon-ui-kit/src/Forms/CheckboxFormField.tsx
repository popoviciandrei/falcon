import React from 'react';
import { Field, getDefaultInputValidators } from '@deity/falcon-front-kit';
import { Box, Label, Checkbox, FlexLayout, extractThemableProps, themed } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';
import { FormFieldProps } from './FormField';
import { FormFieldError } from './FormFieldError';
import { FormFieldArea } from './FormFieldLayout';

export const CheckboxFormFieldLayout = themed({
  tag: Box,
  defaultTheme: {
    checkboxFormFieldLayout: {
      display: 'grid',
      gridGap: 'xs',
      // prettier-ignore
      gridTemplate: toGridTemplate([
        ['auto',             '1fr'                      ],
        [FormFieldArea.input, FormFieldArea.label       ],
        [FormFieldArea.error, FormFieldArea.error, '0px']
      ])
    }
  }
});

export const CheckboxFormField: React.SFC<FormFieldProps> = props => {
  const { name, validate, required, children, ...restProps } = props;
  const { themableProps, rest } = extractThemableProps(restProps);

  return (
    <Field name={name} validate={getDefaultInputValidators(props)} {...rest}>
      {({ form, field, label, error }) => (
        <CheckboxFormFieldLayout {...themableProps}>
          <Checkbox
            {...field}
            gridArea={FormFieldArea.input}
            checked={field.value}
            onChange={e => form.setFieldValue(field.name, e.target.checked)}
          />
          <FlexLayout alignItems="center" gridArea={FormFieldArea.label}>
            <Label htmlFor={field.id}>{label}</Label>
          </FlexLayout>

          <FormFieldError>{field.invalid ? error : null}</FormFieldError>
        </CheckboxFormFieldLayout>
      )}
    </Field>
  );
};
