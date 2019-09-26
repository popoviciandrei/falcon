import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Text, Button } from '@deity/falcon-ui';
import { EmptyMiniCartLayout } from './EmptyMiniCartLayout';

export type EmptyMiniCartProps = {
  onGoShopping: Function;
};
export const EmptyMiniCart: React.SFC<EmptyMiniCartProps> = ({ onGoShopping }) => (
  <EmptyMiniCartLayout>
    <Text fontSize="md">
      <T id="miniCart.empty" />
    </Text>
    <Button onClick={() => onGoShopping()} mt="lg">
      <T id="miniCart.goShoppingButton" />
    </Button>
  </EmptyMiniCartLayout>
);
