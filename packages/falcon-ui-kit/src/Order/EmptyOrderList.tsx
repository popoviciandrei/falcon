import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Text, Button, FlexLayout } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';

export const EmptyOrderList: React.SFC<{}> = () => (
  <FlexLayout flexDirection="column" alignItems="center" p="sm">
    <Text fontSize="md" mb="xs">
      <T id="orderList.empty" />
    </Text>
    <Button as={RouterLink} to="/">
      <T id="cart.goShoppingButton" />
    </Button>
  </FlexLayout>
);
