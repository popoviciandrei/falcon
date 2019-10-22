import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Text, Button, Box } from '@deity/falcon-ui';

export type InvalidResetPasswordTokenProps = {
  onRequestAnotherToken: Function;
};
export const InvalidResetPasswordToken: React.SFC<InvalidResetPasswordTokenProps> = ({ onRequestAnotherToken }) => (
  <React.Fragment>
    <Text fontSize="md" color="error" style={{ textAlign: 'center' }}>
      <T id="resetPassword.failureMessage" />
    </Text>
    <Box justifySelf="center">
      <Button onClick={() => onRequestAnotherToken()}>
        <T id="resetPassword.requestAnotherToken" />
      </Button>
    </Box>
  </React.Fragment>
);
