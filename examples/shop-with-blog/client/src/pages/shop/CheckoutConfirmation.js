import React from 'react';
import { T } from '@deity/falcon-i18n';
import { LastOrderQuery } from '@deity/falcon-shop-data';
import { Box, H1, Text, FlexLayout } from '@deity/falcon-ui';
import { PageLayout } from '@deity/falcon-ui-kit';

const OrderSummary = ({ order }) => (
  <Box>
    {order.items.map(item => (
      <Text fontWeight="bold" key={item.itemId}>
        {item.name}
      </Text>
    ))}
  </Box>
);

const CheckoutConfirmation = () => (
  <PageLayout>
    <H1 css={{ textAlign: 'center' }}>
      <T id="checkoutConfirmation.title" />
    </H1>
    <LastOrderQuery>
      {({ data: { lastOrder } }) => (
        <FlexLayout my="lg" flexDirection="column" alignItems="center">
          <Text>
            <T id="checkoutConfirmation.orderReceived" referenceNo={lastOrder.referenceNo} />
          </Text>
          <OrderSummary my="sm" order={lastOrder} />
          <Text my="sm">
            <T id="checkoutConfirmation.realizationNotice" />
          </Text>
          <Text>
            <T id="checkoutConfirmation.shippingNotice" />
          </Text>
        </FlexLayout>
      )}
    </LastOrderQuery>
  </PageLayout>
);

export default CheckoutConfirmation;
