import React from 'react';
import { Text } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { EmptyProductListLayout } from './EmptyProductListLayout';

export const EmptyProductList: React.SFC<{}> = () => (
  <EmptyProductListLayout>
    <Text fontSize="md" mb="xs">
      <T id="productList.empty" />
    </Text>
  </EmptyProductListLayout>
);
