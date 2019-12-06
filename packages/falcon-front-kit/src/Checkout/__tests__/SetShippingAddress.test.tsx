import { readFileSync } from 'fs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, MutationResult } from '@apollo/react-common';
import { SetShippingAddressResponse } from '@deity/falcon-shop-data';
import {
  Checkout,
  CheckoutRenderProps,
  CheckoutProvider,
  CheckoutOperationFunction,
  SetShippingAddress,
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

describe('<Checkout/> SetShippingAddress', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let CheckoutContext;
  let checkoutOperation: CheckoutOperationFunction<SetShippingAddressResponse, CheckoutAddress>;
  let checkoutOperationResult: MutationResult<SetShippingAddressResponse>;
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
                <SetShippingAddress>
                  {(operation, result) => {
                    checkoutOperation = operation;
                    checkoutOperationResult = result;

                    return <div />;
                  }}
                </SetShippingAddress>
              );
            }}
          </Checkout>
        </CheckoutProvider>
      </ApolloProvider>
    );
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  describe('when setting shipping address', () => {
    it('should properly set shipping address on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              setShippingAddress: () => true
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.values.shippingAddress).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleAddress);
      });

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.shippingAddress).toEqual(sampleAddress);
      expect(checkoutRenderProps.isLoading).toBeFalsy();
    });
  });

  describe('when setting shipping address fail', () => {
    it('should not set shipping address on Checkout context', async () => {
      wrapper = mount(
        <CheckoutContext
          apolloClient={createApolloClient({
            Mutation: {
              setShippingAddress: () => {
                throw new Error('setShippingAddress error');
              }
            }
          })}
        />
      );

      expect(checkoutRenderProps.isLoading).toBeFalsy();
      expect(checkoutRenderProps.values.shippingAddress).toBeUndefined();

      await act(async () => {
        return checkoutOperation(sampleAddress);
      });

      expect(isLoading).toBeTruthy();
      expect(checkoutRenderProps.values.shippingAddress).toBeUndefined();
      expect(checkoutOperationResult.error).toBeDefined();
      expect(checkoutRenderProps.isLoading).toBeFalsy();
    });
  });
});
