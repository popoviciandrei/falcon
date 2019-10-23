import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { T } from '@deity/falcon-i18n';
import { OrderListQuery } from '@deity/falcon-shop-data';
import { H1, Button, GridLayout, FlexLayout } from '@deity/falcon-ui';
import { OrderListLayout, OrderListHeader, EmptyOrderList } from '@deity/falcon-ui-kit';
import { OrderList } from './OrderList';

const Orders = () => (
  <GridLayout>
    <H1>
      <T id="orderList.title" />
    </H1>
    <OrderListQuery>
      {({ data: { orderList }, fetchMore, networkStatus }) =>
        orderList.items.length ? (
          <OrderListLayout>
            <OrderListHeader />
            <OrderList items={orderList.items} />
            {orderList.pagination.nextPage && (
              <FlexLayout justifyContent="center">
                <Button
                  onClick={fetchMore}
                  variant={networkStatus === NetworkStatus.fetchMore ? 'loader' : 'secondary'}
                  height="xl"
                >
                  <T id="orderList.showMore" />
                </Button>
              </FlexLayout>
            )}
          </OrderListLayout>
        ) : (
          <EmptyOrderList />
        )
      }
    </OrderListQuery>
  </GridLayout>
);

export default Orders;
