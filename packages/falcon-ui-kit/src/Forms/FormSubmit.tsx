import React from 'react';
import { Box, BoxProps, Button } from '@deity/falcon-ui';

export const FormSubmit: React.SFC<{ submitting: boolean; value: string } & BoxProps> = ({
  submitting,
  value,
  children,
  ...rest
}) => (
  <Box justifySelf="end" mt="md" {...rest}>
    {children || (
      <Button type="submit" variant={submitting ? 'loader' : undefined}>
        {value}
      </Button>
    )}
  </Box>
);
