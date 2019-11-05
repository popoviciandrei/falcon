import React from 'react';
import { FieldProps as FormikFieldProps } from 'formik';
import { Field, IValidator, getDefaultInputValidators } from '@deity/falcon-front-kit';
import { Input, extractThemableProps, ThemedComponentProps } from '@deity/falcon-ui';
import { FormFieldLabel } from './FormFieldLabel';
import { FormFieldError } from './FormFieldError';
import { FormFieldArea, FormFieldLayout } from './FormFieldLayout';

export type FormFieldRenderProps<TValue = any> = {
  form: FormikFieldProps<TValue>['form'] & {
    id?: number | string;
  };
  field: FormikFieldProps<TValue>['field'] &
    React.InputHTMLAttributes<HTMLInputElement> &
    ThemedComponentProps & {
      id?: string;
      placeholder?: string;
      invalid: boolean;
    };
};

export type FormFieldProps<TValue = any> = {
  id?: number | string;
  name: string;
  label?: string;
  placeholder?: string;
  /**
   * Allows you to extends default set of validators which are calculated based on HTML Input `type` attribute,
   * also if `required`, `min` or `max` HTML Input Attributes are passed, then corresponding validator will be automatically added.
   *
   * Please pass empty array (`[]`) in order to disable all default validators.
   * @see https://github.com/deity-io/falcon/blob/db40dc1c61fc17eb3276cdeb7a46c6ba77337314/packages/falcon-front-kit/src/Forms/getDefaultInputValidators.ts#L9
   * @see https://www.w3schools.com/html/html_form_attributes.asp
   */
  validate?: IValidator[];
  children?: (props: FormFieldRenderProps<TValue>) => React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
  ThemedComponentProps;

export const FormField: React.SFC<FormFieldProps> = props => {
  const { name, validate, required, children, ...restProps } = props;
  const { themableProps, rest } = extractThemableProps(restProps);

  return (
    <Field name={name} validate={getDefaultInputValidators(props)} {...rest}>
      {({ form, field, label, error }) => (
        <FormFieldLayout {...themableProps}>
          {label && <FormFieldLabel htmlFor={field.id}>{label}</FormFieldLabel>}
          {children ? (
            children({ form, field: { ...field, gridArea: FormFieldArea.input } })
          ) : (
            <Input {...field} gridArea={FormFieldArea.input} />
          )}
          <FormFieldError>{field.invalid ? error : null}</FormFieldError>
        </FormFieldLayout>
      )}
    </Field>
  );
};
