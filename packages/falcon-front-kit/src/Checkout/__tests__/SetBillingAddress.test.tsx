import { readFileSync } from 'fs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationResult } from '@apollo/react-common';
import { SetBillingAddressResponse } from '@deity/falcon-shop-data';
import {
  Checkout,
  CheckoutRenderProps,
  CheckoutProvider,
  CheckoutOperationFunction,
  SetBillingAddress,
  CheckoutAddress
} from '..';

const BaseSchema = readFileSync(require.resolve('@deity/falcon-server/schema.graphql'), 'utf8');
const Schema = readFileSync(require.resolve('@deity/falcon-shop-extension/schema.graphql'), 'utf8');

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

describe('<Checkout/> SetBillingAddress', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let CheckoutContext;
  let checkoutRenderProps: CheckoutRenderProps;
  let isLoading: boolean;
  let checkoutOperation: CheckoutOperationFunction<SetBillingAddressResponse, CheckoutAddress>;
  let checkoutOperationResult: MutationResult<SetBillingAddressResponse>;

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
                <SetBillingAddress>
                  {(operation, result) => {
                    checkoutOperation = operation;
                    checkoutOperationResult = result;

                    return <div />;
                  }}
                </SetBillingAddress>
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

  describe('when setting billing address', () => {
    it('should properly set billing address on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              setBillingAddress: () => true
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.values.billingAddress).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleAddress);
      });

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.billingAddress).toEqual(sampleAddress);
      expect(checkoutRenderProps.isLoading).toBeFalsy();
    });
  });

  describe('when setting shipping address fail', () => {
    it('should not set billing address on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              setBillingAddress: () => {
                throw new Error('setBillingAddress error');
              }
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.values.billingAddress).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleAddress);
      });

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.billingAddress).toBeUndefined();
      expect(checkoutOperationResult.error).toBeDefined();
      expect(checkoutRenderProps.isLoading).toBeFalsy();
    });
  });
});
