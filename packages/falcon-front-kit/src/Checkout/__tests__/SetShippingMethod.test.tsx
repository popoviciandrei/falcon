import { readFileSync } from 'fs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationResult } from '@apollo/react-common';
import { SetShippingMethodResponse } from '@deity/falcon-shop-data';
import { ShippingMethod } from '@deity/falcon-shop-extension';
import { Checkout, CheckoutRenderProps, CheckoutProvider, CheckoutOperationFunction, SetShippingMethod } from '..';

const BaseSchema = readFileSync(require.resolve('@deity/falcon-server/schema.graphql'), 'utf8');
const Schema = readFileSync(require.resolve('@deity/falcon-shop-extension/schema.graphql'), 'utf8');

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

const createApolloClient = (resolvers: any) => {
  const schema = makeExecutableSchema({ typeDefs: [BaseSchema, Schema], resolvers });
  const link = new SchemaLink({ schema });
  const cache = new InMemoryCache({ addTypename: false });
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

describe('SetShippingMethod', () => {
  describe('when setting shipping method', () => {
    let wrapper: ReactWrapper<any, any> | null;
    let client: ApolloClient<any>;

    beforeEach(() => {
      client = createApolloClient({
        Mutation: {
          setShippingMethod: () => true
        }
      });
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should properly set shipping method on Checkout context', async () => {
      let checkoutOperation: CheckoutOperationFunction<SetShippingMethodResponse, ShippingMethod>;
      let checkoutOperationResult: MutationResult<SetShippingMethodResponse>;
      let props: CheckoutRenderProps;
      let isLoading: boolean;
      wrapper = mount(
        <ApolloProvider client={client}>
          <CheckoutProvider>
            <Checkout>
              {renderProps => {
                props = renderProps;
                if (renderProps.isLoading) {
                  isLoading = true;
                }

                return (
                  <SetShippingMethod>
                    {(operation, result) => {
                      checkoutOperation = operation;
                      checkoutOperationResult = result;

                      return <div />;
                    }}
                  </SetShippingMethod>
                );
              }}
            </Checkout>
          </CheckoutProvider>
        </ApolloProvider>
      );

      expect(props.isLoading).toBeFalsy();
      expect(props.values.shippingMethod).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleShippingMethod);
      });

      expect(isLoading).toBeTruthy();
      expect(props.values.shippingMethod).toEqual(sampleShippingMethod);
      expect(props.isLoading).toBeFalsy();
    });
  });

  describe('when setting shipping address fail', () => {
    let wrapper: ReactWrapper<any, any> | null;
    let client: ApolloClient<any>;

    beforeEach(() => {
      client = createApolloClient({
        Mutation: {
          setShippingMethod: () => {
            throw new Error('setShipping error');
          }
        }
      });
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should not set shipping method on Checkout context', async () => {
      let checkoutOperation: CheckoutOperationFunction<SetShippingMethodResponse, ShippingMethod>;
      let checkoutOperationResult: MutationResult<SetShippingMethodResponse>;
      let props: CheckoutRenderProps;
      let isLoading: boolean;
      wrapper = mount(
        <ApolloProvider client={client}>
          <CheckoutProvider>
            <Checkout>
              {renderProps => {
                props = renderProps;
                if (renderProps.isLoading) {
                  isLoading = true;
                }

                return (
                  <SetShippingMethod>
                    {(operation, result) => {
                      checkoutOperation = operation;
                      checkoutOperationResult = result;

                      return <div />;
                    }}
                  </SetShippingMethod>
                );
              }}
            </Checkout>
          </CheckoutProvider>
        </ApolloProvider>
      );

      expect(props.isLoading).toBeFalsy();
      expect(props.values.shippingMethod).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleShippingMethod);
      });

      expect(isLoading).toBeTruthy();
      expect(props.values.shippingMethod).toBeUndefined();
      expect(checkoutOperationResult.error).toBeDefined();
      expect(props.isLoading).toBeFalsy();
    });
  });
});
