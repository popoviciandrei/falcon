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
} from '..';

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

describe('<Checkout/> SetPaymentMethod', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let CheckoutContext;
  let checkoutOperation: CheckoutOperationFunction<SetPaymentMethodResponse, PaymentMethodData>;
  let checkoutOperationResult: MutationResult<SetPaymentMethodResponse>;
  let checkoutRenderProps: CheckoutRenderProps;
  let isLoading: boolean;

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

  describe('when setting payment method', () => {
    it('should properly set payment method on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              setPaymentMethod: () => true
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.values.paymentMethod).toBeUndefined();

      await act(async () => {
        return checkoutOperation(samplePaymentMethod);
      });

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.paymentMethod).toEqual(samplePaymentMethod);
      expect(checkoutRenderProps.isLoading).toBeFalsy();
    });
  });

  describe('when setting shipping address fail', () => {
    it('should not set payment method on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              setPaymentMethod: () => {
                throw new Error('setPaymentMethod error');
              }
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.values.paymentMethod).toBeUndefined();

      await act(async () => {
        return checkoutOperation(samplePaymentMethod);
      });

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.paymentMethod).toBeUndefined();
      expect(checkoutOperationResult.error).toBeDefined();
      expect(checkoutRenderProps.isLoading).toBeFalsy();
    });
  });
});
