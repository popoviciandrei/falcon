import React from 'react';
import { FormikProps, useFormik, useFormikContext } from 'formik';
import { Button, BoxProps, extractThemableProps, Box } from '@deity/falcon-ui';
import { Submit } from '@deity/falcon-front-kit';

export type FormSubmitRenderProps<TValue = any> = {
  form: FormikProps<TValue> & {
    id?: number | string;
  };
  submit: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value?: string;
  };
};

export type FormSubmitProps<TValue = any> = {
  value?: string;
  children?: (props: FormSubmitRenderProps<TValue>) => React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  BoxProps;

export const FormSubmit: React.SFC<FormSubmitProps> = ({ value, children, ...restProps }) => {
  const { themableProps, rest } = extractThemableProps(restProps);

  return (
    <Submit {...rest}>
      {({ form, submit }) =>
        children ? (
          children({ form, submit })
        ) : (
          <Box {...themableProps}>
            <Button
              type="submit"
              disabled={form.isSubmitting}
              variant={form.isSubmitting ? 'loader' : undefined}
              {...submit}
            >
              {value || submit.value}
            </Button>
          </Box>
        )
      }
    </Submit>
  );
};
