import React from 'react';
import { connect, FormikProps } from 'formik';
import { Box, Button, ThemedComponentProps } from '@deity/falcon-ui';

export type FormSubmitProps = {
  value: string;
} & InjectedProps;

type InjectedProps = {
  formik?: FormikProps<{}>;
};

const FormSubmitWithFormik: React.SFC<FormSubmitProps & ThemedComponentProps> = ({
  value,
  formik,
  children,
  ...rest
}) => (
  <Box justifySelf="end" mt="md" {...(rest as any)}>
    {children || (
      <Button type="submit" variant={formik.isSubmitting ? 'loader' : undefined}>
        {value}
      </Button>
    )}
  </Box>
);

export const FormSubmit = connect(FormSubmitWithFormik);
