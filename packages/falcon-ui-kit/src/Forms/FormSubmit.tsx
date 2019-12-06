import React from 'react';
import { FormikProps } from 'formik';
import { Button, BoxProps, extractThemableProps } from '@deity/falcon-ui';
import { Submit } from '@deity/falcon-front-kit';

export type FormSubmitRenderProps<TValue = any> = {
  form: FormikProps<TValue> & {
    id?: number | string;
  };
  submit: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value?: string;
  };
};

export type FormSubmitProps = {} & React.ButtonHTMLAttributes<HTMLButtonElement> & BoxProps;

export const FormSubmit: React.SFC<FormSubmitProps> = ({ value, children, ...restProps }) => {
  const { themableProps, rest } = extractThemableProps(restProps);

  return (
    <Submit {...rest}>
      {({ form, submit: { value: submitValue, ...submitRest } }) => (
        <Button
          type="submit"
          disabled={form.isSubmitting}
          variant={form.isSubmitting ? 'loader' : undefined}
          {...submitRest}
          {...themableProps}
        >
          {children || value || submitValue}
        </Button>
      )}
    </Submit>
  );
};
