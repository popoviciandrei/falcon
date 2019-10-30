import { readFileSync } from 'fs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-common';
import { PlaceOrderSuccessfulResult } from '@deity/falcon-shop-extension';
import { CheckoutConsumer, CheckoutProvider, CheckoutProviderRenderProps } from './CheckoutContext';

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
            name: 'PlaceOrderSuccessfulResult'
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

const sampleAddress = {
  id: 1,
  firstname: 'foo',
  lastname: 'bar',
  city: 'Sample City',
  postcode: '00000',
  street: ['Sample Street 12'],
  countryId: 'NL',
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

const resolversWithoutErrors = {
  Query: {
    shippingMethodList: () => [sampleShippingMethod],
    paymentMethodList: () => [samplePaymentMethod]
  },
  Mutation: {
    setShippingAddress: () => true,
    setBillingAddress: () => true,
    setPaymentMethod: () => true,
    setShippingMethod: () => true,
    placeOrder: () => ({
      orderId: '10',
      orderRealId: '010'
    })
  }
};

const resolversWithErrors = {
  Query: {
    shippingMethodList: () => {
      throw new Error('shippingMethodList error');
    },
    paymentMethodList: () => {
      throw new Error('paymentMethodList error');
    }
  },
  Mutation: {
    setPaymentMethod: () => {
      throw new Error('setPaymentMethod error');
    },
    setShippingMethod: () => {
      throw new Error('setShipping error');
    },
    setShippingAddress: () => {
      throw new Error('setShippingAddress error');
    },
    setBillingAddress: () => {
      throw new Error('setBillingAddress error');
    },
    placeOrder: () => {
      throw new Error('placeOrder error');
    }
  }
};

const createApolloClient = (resolvers: any) => {
  resolvers.PlaceOrderResult = {
    __resolveType: (obj: any) => (obj.orderId ? 'PlaceOrderSuccessfulResult' : 'PlaceOrder3dSecureResult')
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

declare type RenderCheckoutLogicArgs = {
  onStateUpdated?: (data: CheckoutProviderRenderProps) => void;
};

describe('<CheckoutContext/>', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let client: ApolloClient<any>;

  const renderCheckoutLogic = (
    data?: RenderCheckoutLogicArgs
  ): {
    getProps: () => CheckoutProviderRenderProps;
    wrapper: ReactWrapper<any, any>;
  } => {
    let renderedProps: CheckoutProviderRenderProps;
    wrapper = mount(
      <ApolloProvider client={client}>
        <CheckoutProvider>
          <CheckoutConsumer>
            {logicData => {
              if (data && data.onStateUpdated) {
                data.onStateUpdated(logicData);
              }
              renderedProps = logicData;
              return <div />;
            }}
          </CheckoutConsumer>
        </CheckoutProvider>
      </ApolloProvider>
    );

    return {
      getProps: () => renderedProps,
      wrapper
    };
  };

  describe('Successful scenarios', () => {
    beforeEach(() => {
      client = createApolloClient(resolversWithoutErrors);
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should pass render props correctly to the render function', async () => {
      const { getProps } = renderCheckoutLogic();
      expect(getProps().values).toBeDefined();
    });

    it('should properly set email when setEmail() method is called', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setEmail('foo@bar.com');
      });
      expect(getProps().values.email).toBe('foo@bar.com');
    });

    it('should properly set shipping address data when address is passed to setShippingAddress()', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setShippingAddress(sampleAddress);
      });
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
    });

    it('should properly set billing address data when address is passed to setBillingAddress()', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setBillingAddress(sampleAddress);
      });
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
    });

    it('should properly set billing address data when setBillingSameAsShipping(true) is called', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setShippingAddress(sampleAddress);
      });
      await act(async () => {
        getProps().setBillingSameAsShipping(true);
      });
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
    });

    it('should properly return available shipping options when shipping and billing addresses are set', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setShippingAddress(sampleAddress);
      });
      await act(async () => {
        getProps().setBillingSameAsShipping(true);
      });
      expect(getProps().availableShippingMethods[0]).toEqual(sampleShippingMethod);
    });

    it('should properly return available payment options when shipping method is set', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setShippingAddress(sampleAddress);
        getProps().setBillingSameAsShipping(true);
        getProps().setShippingMethod({
          method: sampleShippingMethod.methodCode,
          data: {
            ...sampleShippingMethod
          }
        });
      });
      expect(getProps().availablePaymentMethods[0]).toEqual(samplePaymentMethod);
    });

    it('should properly return orderId when order was placed', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setEmail('foo@bar.com');
        getProps().setShippingAddress(sampleAddress);
      });
      await act(async () => {
        getProps().setBillingSameAsShipping(true);
      });
      await act(async () => {
        getProps().setShippingMethod({
          method: sampleShippingMethod.methodCode,
          data: {
            ...sampleShippingMethod
          }
        });
      });
      await act(async () => {
        getProps().setPaymentMethod({
          method: samplePaymentMethod.code,
          data: {}
        });
      });
      await act(async () => {
        getProps().placeOrder();
      });
      expect((getProps().result! as PlaceOrderSuccessfulResult).orderId).toBe('10');
    });
  });

  describe('Error scenarios', () => {
    beforeEach(() => {
      client = createApolloClient(resolversWithErrors);
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should pass errors passed from backend for setShippingAddress', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setShippingAddress(sampleAddress);
      });
      expect(getProps().errors.shippingAddress).toBeDefined();
    });

    it('should pass errors passed from backend for setShipping', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setShippingMethod({
          method: sampleShippingMethod.methodCode,
          data: {
            ...sampleShippingMethod
          }
        });
      });
      expect(getProps().errors.shippingMethod).toBeDefined();
    });

    it('should pass errors passed from backend for placeOrder', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setPaymentMethod({
          method: samplePaymentMethod.code,
          data: {}
        });
        getProps().placeOrder();
      });
      expect(getProps().errors.order).toBeDefined();
    });

    it('should reset availableShippingMethods when setShippingAddress returns error', async () => {
      const { getProps } = renderCheckoutLogic();
      await act(async () => {
        getProps().setShippingAddress(sampleAddress);
      });
      expect(getProps().availableShippingMethods).toEqual([]);
    });
  });

  describe('Loading states', () => {
    beforeEach(() => {
      client = createApolloClient(resolversWithoutErrors);
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
        wrapper = null;
      }
    });

    it('should set loading flag to true when setShippingAddress mutation starts', async () => {
      let loadingChanged = false;
      const { getProps } = renderCheckoutLogic({
        onStateUpdated: data => {
          if (data.loading) {
            loadingChanged = true;
          }
        }
      });
      expect(getProps().loading).toBe(false);
      await act(async () => {
        getProps().setShippingAddress(sampleAddress);
      });
      expect(getProps().values.shippingAddress).toBe(sampleAddress);
      expect(getProps().loading).toBe(false);
      expect(loadingChanged).toBe(true);
    });

    it('should set loading flag to true when setShippingMethod mutation starts', async () => {
      let loadingChanged = false;
      const { getProps } = renderCheckoutLogic({
        onStateUpdated: data => {
          if (data.loading) {
            loadingChanged = true;
          }
        }
      });
      expect(getProps().loading).toBe(false);
      await act(async () => {
        getProps().setShippingMethod({
          method: sampleShippingMethod.methodCode,
          data: {
            ...sampleShippingMethod
          }
        });
      });
      expect(getProps().loading).toBe(false);
      expect(loadingChanged).toBe(true);
    });

    it('should set loading flag to true when placeOrder mutation starts', async () => {
      let loadingChangedTimes = 0;
      const { getProps } = renderCheckoutLogic({
        onStateUpdated: data => {
          if (data.loading) {
            loadingChangedTimes++;
          }
        }
      });
      expect(getProps().loading).toBe(false);
      await act(async () => {
        getProps().setPaymentMethod({ method: samplePaymentMethod.code, data: {} });
      });
      await act(async () => {
        getProps().placeOrder();
      });
      expect(getProps().loading).toBe(false);
      expect(loadingChangedTimes).toBe(2);
    });
  });
});
