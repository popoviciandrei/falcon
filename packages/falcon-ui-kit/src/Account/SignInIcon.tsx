import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Box, Icon, Text, IconRenderer } from '@deity/falcon-ui';

/* eslint-disable */
export const UserIconFallback = () => (
  <IconRenderer as={Text} style={{ textAlign: 'center' }}>
    👤
  </IconRenderer>
);
/* eslint-enable */

export const SignInIcon: React.SFC = () => (
  <Box css={{ position: 'relative' }}>
    <Icon src="user" fallback={<UserIconFallback />} />
    <Text
      color="primary"
      fontSize="xs"
      fontWeight="bold"
      css={{
        whiteSpace: 'nowrap',
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translate(-50%, 0)'
      }}
    >
      <T id="signIn.link" />
    </Text>
  </Box>
);
