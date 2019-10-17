import React from 'react';
import { Box, Badge, Icon } from '@deity/falcon-ui';

export const CartIcon: React.SFC<{ itemsQty?: number }> = ({ itemsQty }) => (
  <Box css={{ position: 'relative' }}>
    <Icon src="cart" />
    {!!itemsQty && (
      <Badge
        borderRadius="round"
        boxShadow="pronounced"
        fontSize="xs"
        size="md"
        fontWeight="bold"
        p="none"
        css={{
          position: 'absolute',
          bottom: '-10px',
          right: '-10px'
        }}
      >
        {itemsQty}
      </Badge>
    )}
  </Box>
);
