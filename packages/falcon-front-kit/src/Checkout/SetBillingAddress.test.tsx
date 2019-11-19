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
} from '.';

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

describe('SetBillingAddress', () => {
  describe('when setting billing address', () => {
    let wrapper: ReactWrapper<any, any> | null;
    let client: ApolloClient<any>;

    beforeEach(() => {
      client = createApolloClient({
        Mutation: {
          setBillingAddress: () => true
        }
      });
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should properly set billing address on Checkout context', async () => {
      let checkoutOperation: CheckoutOperationFunction<SetBillingAddressResponse, CheckoutAddress>;
      let checkoutOperationResult: MutationResult<SetBillingAddressResponse>;
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

      expect(props.isLoading).toBeFalsy();
      expect(props.values.billingAddress).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleAddress);
      });

      expect(isLoading).toBeTruthy();
      expect(props.values.billingAddress).toEqual(sampleAddress);
      expect(props.isLoading).toBeFalsy();
    });
  });

  describe('when setting shipping address fail', () => {
    let wrapper: ReactWrapper<any, any> | null;
    let client: ApolloClient<any>;

    beforeEach(() => {
      client = createApolloClient({
        Mutation: {
          setBillingAddress: () => {
            throw new Error('setBillingAddress error');
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

    it('should not set billing address on Checkout context', async () => {
      let checkoutOperation: CheckoutOperationFunction<SetBillingAddressResponse, CheckoutAddress>;
      let checkoutOperationResult: MutationResult<SetBillingAddressResponse>;
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

      expect(props.isLoading).toBeFalsy();
      expect(props.values.billingAddress).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleAddress);
      });

      expect(isLoading).toBeTruthy();
      expect(props.values.billingAddress).toBeUndefined();
      expect(checkoutOperationResult.error).toBeDefined();
      expect(props.isLoading).toBeFalsy();
    });
  });
});
