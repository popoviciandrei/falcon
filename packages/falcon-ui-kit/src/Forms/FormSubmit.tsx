import React from 'react';
import { connect, FormikProps } from 'formik';
import { Box, Button, BoxProps } from '@deity/falcon-ui';

export type FormSubmitProps = {
  value: string;
} & InjectedProps;

type InjectedProps = {
  formik?: FormikProps<{}>;
};

const FormSubmitInner: React.SFC<FormSubmitProps & BoxProps> = ({ value, formik, children, ...rest }) => (
  <Box justifySelf="end" mt="md" {...rest}>
    {children || (
      <Button type="submit" disabled={formik.isSubmitting} variant={formik.isSubmitting ? 'loader' : undefined}>
        {value}
      </Button>
    )}
  </Box>
);

export const FormSubmit = connect(FormSubmitInner);
