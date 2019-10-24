import React from 'react';
import { connect, FormikProps } from 'formik';
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
} & InjectedProps<TValue> &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  BoxProps;

type InjectedProps<TValue = any> = {
  formik?: FormikProps<TValue>;
};

const FormSubmitInner: React.SFC<FormSubmitProps> = ({ value, formik, children, ...restProps }) => {
  const { themableProps, rest } = extractThemableProps(restProps);
  return (
    <Submit form={formik} value={value} {...rest}>
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
              {submit.value}
            </Button>
          </Box>
        )
      }
    </Submit>
  );
};

export const FormSubmit = connect(FormSubmitInner);
