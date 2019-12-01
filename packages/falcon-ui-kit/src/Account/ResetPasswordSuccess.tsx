import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Text, Button, Box } from '@deity/falcon-ui';

export type ResetPasswordSuccessProps = {
  onSignIn: Function;
};
export const ResetPasswordSuccess: React.SFC<ResetPasswordSuccessProps> = ({ onSignIn }) => (
  <>
    <Text fontSize="md" style={{ textAlign: 'center' }}>
      <T id="resetPassword.successMessage" />
    </Text>
    <Box justifySelf="center">
      <Button onClick={() => onSignIn()}>
        <T id="signIn.submitButton" />
      </Button>
    </Box>
  </>
);
