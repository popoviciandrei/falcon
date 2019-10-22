import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Box, Icon, Text } from '@deity/falcon-ui';
import { UserIconFallback } from './SignInIcon';

export const AccountIcon: React.SFC = () => (
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
      <T id="account.link" />
    </Text>
  </Box>
);
