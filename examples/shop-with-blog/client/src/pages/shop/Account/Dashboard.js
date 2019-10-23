import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { CustomerQuery, OrderListQuery } from '@deity/falcon-shop-data';
import { Box, H1, H2, Text, Link, Divider, GridLayout, FlexLayout } from '@deity/falcon-ui';
import { EmptyOrderList, OrderListLayout, OrderListHeader } from '@deity/falcon-ui-kit';
import { OrderList } from './Orders/OrderList';

const Dashboard = () => (
  <GridLayout>
    <H1>
      <T id="dashboard.title" />
    </H1>
    <Box>
      <OrderListQuery variables={{ pagination: { perPage: 1, page: 1 } }}>
        {({ data: { orderList } }) => (
          <React.Fragment>
            <FlexLayout justifyContent="flex-start" alignItems="baseline">
              <H2>
                <T id="dashboard.recentOrder" />
              </H2>
              {!!orderList.items.length && (
                <Link as={RouterLink} to="/account/orders" ml="md">
                  <T id="dashboard.viewAllOrders" />
                </Link>
              )}
            </FlexLayout>
            {orderList.items.length ? (
              <OrderListLayout>
                <OrderListHeader />
                <OrderList items={orderList.items} />
              </OrderListLayout>
            ) : (
              <EmptyOrderList />
            )}
          </React.Fragment>
        )}
      </OrderListQuery>
    </Box>
    <Box>
      <FlexLayout justifyContent="flex-start" alignItems="baseline">
        <H2>
          <T id="dashboard.addressBook" />
        </H2>
        <Link as={RouterLink} to="/account/address-book" ml="md">
          <T id="dashboard.manageAddresses" />
        </Link>
      </FlexLayout>
    </Box>
    <Box>
      <H2>
        <T id="dashboard.personalInformation" />
      </H2>
      <CustomerQuery>
        {({ data: { customer } }) => (
          <React.Fragment>
            <Text>{`${customer.firstname} ${customer.lastname}`}</Text>
            <Text>{customer.email}</Text>
            <FlexLayout flexDirection="row" mt="xs">
              <Link as={RouterLink} to="/account/personal-information">
                <T id="dashboard.editCustomerLink" />
              </Link>
              <Divider variant="horizontal" mx="xs" />
              <Link as={RouterLink} to="/account/change-password">
                <T id="dashboard.changePasswordLink" />
              </Link>
            </FlexLayout>
          </React.Fragment>
        )}
      </CustomerQuery>
    </Box>
  </GridLayout>
);

export default Dashboard;
