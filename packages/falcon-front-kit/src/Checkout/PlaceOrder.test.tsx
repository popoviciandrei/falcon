import { readFileSync } from 'fs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationResult } from '@apollo/react-common';
import { PlaceOrderResponse } from '@deity/falcon-shop-data';
import { Order } from '@deity/falcon-shop-extension';
import {
  Checkout,
  CheckoutRenderProps,
  CheckoutProvider,
  CheckoutOperationFunction,
  PlaceOrder,
  CheckoutAddress,
  OrderData
} from '.';

const BaseSchema = readFileSync(require.resolve('@deity/falcon-server/schema.graphql'), 'utf8');
const Schema = readFileSync(require.resolve('@deity/falcon-shop-extension/schema.graphql'), 'utf8');

const fragmentTypes = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'PlaceOrderResult',
        possibleTypes: [
          {
            name: 'Order'
          },
          {
            name: 'PlaceOrder3dSecureResult'
          }
        ]
      }
    ]
  }
};

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes
});

const sampleAddress: CheckoutAddress = {
  id: 1,
  firstname: 'foo',
  lastname: 'bar',
  city: 'Sample City',
  postcode: '00000',
  street: ['Sample Street 12'],
  country: { id: 'NL', code: 'NL' },
  telephone: '000000000'
};

const sampleShippingMethod = {
  carrierTitle: 'test carrier',
  amount: 10,
  carrierCode: 'test',
  methodCode: 'test',
  methodTitle: 'Test Carrier',
  priceExclTax: 8,
  priceInclTax: 10,
  currency: 'EUR'
};

const samplePaymentMethod = {
  code: 'sample-payment',
  config: null,
  title: 'Sample Payment'
};

const createApolloClient = (resolvers: any) => {
  resolvers.PlaceOrderResult = {
    __resolveType: (obj: any) => (obj.id ? 'Order' : 'PlaceOrder3dSecureResult')
  };

  const schema = makeExecutableSchema({ typeDefs: [BaseSchema, Schema], resolvers });
  const link = new SchemaLink({ schema });
  const cache = new InMemoryCache({ addTypename: false, fragmentMatcher });
  return new ApolloClient({
    link,
    cache,
    defaultOptions: {
      query: {
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all',
        awaitRefetchQueries: true
      }
    }
  });
};

describe('PlaceOrder', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let CheckoutContext;
  let checkoutRenderProps: CheckoutRenderProps;
  let isLoading: boolean;
  let checkoutOperation: CheckoutOperationFunction<PlaceOrderResponse, OrderData>;
  let checkoutOperationResult: MutationResult<PlaceOrderResponse>;

  beforeEach(() => {
    CheckoutContext = ({ apolloClient }) => (
      <ApolloProvider client={apolloClient}>
        <CheckoutProvider>
          <Checkout>
            {renderProps => {
              checkoutRenderProps = renderProps;
              if (renderProps.isLoading) {
                isLoading = true;
              }

              return (
                <PlaceOrder>
                  {(operation, result) => {
                    checkoutOperation = operation;
                    checkoutOperationResult = result;

                    return <div />;
                  }}
                </PlaceOrder>
              );
            }}
          </Checkout>
        </CheckoutProvider>
      </ApolloProvider>
    );
  });

  afterEach(() => {
    checkoutRenderProps = undefined;
    isLoading = false;
    checkoutOperation = undefined;
    checkoutOperationResult = undefined;

    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  describe('when placing order', () => {
    it('should properly set order data and place order result on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              placeOrder: () => ({
                id: 10,
                referenceNo: '010'
              })
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.result).toBeUndefined();
      expect(checkoutRenderProps.values.email).toBeUndefined();
      expect(checkoutRenderProps.values.shippingAddress).toBeUndefined();
      expect(checkoutRenderProps.values.billingAddress).toBeUndefined();
      expect(checkoutRenderProps.values.shippingMethod).toBeUndefined();
      expect(checkoutRenderProps.values.paymentMethod).toBeUndefined();

      await act(async () =>
        checkoutOperation({
          email: 'test@test.co.uk',
          shippingAddress: sampleAddress,
          billingAddress: sampleAddress,
          shippingMethod: sampleShippingMethod,
          paymentMethod: samplePaymentMethod
        })
      );

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.email).toEqual('test@test.co.uk');
      expect(checkoutRenderProps.values.shippingAddress).toEqual(sampleAddress);
      expect(checkoutRenderProps.values.billingAddress).toEqual(sampleAddress);
      expect(checkoutRenderProps.values.shippingMethod).toEqual(sampleShippingMethod);
      expect(checkoutRenderProps.values.paymentMethod).toEqual(samplePaymentMethod);
      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.result).toBeDefined();
      expect((checkoutRenderProps.result as Order).id).toEqual('10');
      expect((checkoutRenderProps.result as Order).referenceNo).toEqual('010');
    });
  });

  describe('when placing order fails', () => {
    it('should properly set order data but should not set order result on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              placeOrder: () => {
                throw new Error('placeOrder error');
              }
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.result).toBeUndefined();
      expect(checkoutRenderProps.values.email).toBeUndefined();
      expect(checkoutRenderProps.values.shippingAddress).toBeUndefined();
      expect(checkoutRenderProps.values.billingAddress).toBeUndefined();
      expect(checkoutRenderProps.values.shippingMethod).toBeUndefined();
      expect(checkoutRenderProps.values.paymentMethod).toBeUndefined();

      await act(async () =>
        checkoutOperation({
          email: 'test@test.co.uk',
          shippingAddress: sampleAddress,
          billingAddress: sampleAddress,
          shippingMethod: sampleShippingMethod,
          paymentMethod: samplePaymentMethod
        })
      );

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.email).toEqual('test@test.co.uk');
      expect(checkoutRenderProps.values.shippingAddress).toEqual(sampleAddress);
      expect(checkoutRenderProps.values.billingAddress).toEqual(sampleAddress);
      expect(checkoutRenderProps.values.shippingMethod).toEqual(sampleShippingMethod);
      expect(checkoutRenderProps.values.paymentMethod).toEqual(samplePaymentMethod);

      expect(checkoutRenderProps.result).toBeUndefined();
      expect(checkoutOperationResult.error).toBeDefined();
      expect(checkoutRenderProps.isLoading).toBeFalsy();
    });
  });
});
