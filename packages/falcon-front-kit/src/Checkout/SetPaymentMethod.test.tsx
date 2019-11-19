import { readFileSync } from 'fs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationResult } from '@apollo/react-common';
import { SetPaymentMethodResponse } from '@deity/falcon-shop-data';
import {
  Checkout,
  CheckoutRenderProps,
  CheckoutProvider,
  CheckoutOperationFunction,
  SetPaymentMethod,
  PaymentMethodData
} from '.';

const BaseSchema = readFileSync(require.resolve('@deity/falcon-server/schema.graphql'), 'utf8');
const Schema = readFileSync(require.resolve('@deity/falcon-shop-extension/schema.graphql'), 'utf8');

const samplePaymentMethod = {
  code: 'sample-payment',
  config: null,
  title: 'Sample Payment'
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

describe('SetPaymentMethod', () => {
  describe('when setting payment method', () => {
    let wrapper: ReactWrapper<any, any> | null;
    let client: ApolloClient<any>;

    beforeEach(() => {
      client = createApolloClient({
        Mutation: {
          setPaymentMethod: () => true
        }
      });
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should properly set payment method on Checkout context', async () => {
      let checkoutOperation: CheckoutOperationFunction<SetPaymentMethodResponse, PaymentMethodData>;
      let checkoutOperationResult: MutationResult<SetPaymentMethodResponse>;
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
                  <SetPaymentMethod>
                    {(operation, result) => {
                      checkoutOperation = operation;
                      checkoutOperationResult = result;

                      return <div />;
                    }}
                  </SetPaymentMethod>
                );
              }}
            </Checkout>
          </CheckoutProvider>
        </ApolloProvider>
      );

      expect(props.isLoading).toBeFalsy();
      expect(props.values.paymentMethod).toBeUndefined();

      await act(async () => {
        return checkoutOperation(samplePaymentMethod);
      });

      expect(isLoading).toBeTruthy();
      expect(props.values.paymentMethod).toEqual(samplePaymentMethod);
      expect(props.isLoading).toBeFalsy();
    });
  });

  describe('when setting shipping address fail', () => {
    let wrapper: ReactWrapper<any, any> | null;
    let client: ApolloClient<any>;

    beforeEach(() => {
      client = createApolloClient({
        Mutation: {
          setPaymentMethod: () => {
            throw new Error('setPaymentMethod error');
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

    it('should not set payment method on Checkout context', async () => {
      let checkoutOperation: CheckoutOperationFunction<SetPaymentMethodResponse, PaymentMethodData>;
      let checkoutOperationResult: MutationResult<SetPaymentMethodResponse>;
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
                  <SetPaymentMethod>
                    {(operation, result) => {
                      checkoutOperation = operation;
                      checkoutOperationResult = result;

                      return <div />;
                    }}
                  </SetPaymentMethod>
                );
              }}
            </Checkout>
          </CheckoutProvider>
        </ApolloProvider>
      );

      expect(props.isLoading).toBeFalsy();
      expect(props.values.paymentMethod).toBeUndefined();

      await act(async () => {
        return checkoutOperation(samplePaymentMethod);
      });

      expect(isLoading).toBeTruthy();
      expect(props.values.paymentMethod).toBeUndefined();
      expect(checkoutOperationResult.error).toBeDefined();
      expect(props.isLoading).toBeFalsy();
    });
  });
});
