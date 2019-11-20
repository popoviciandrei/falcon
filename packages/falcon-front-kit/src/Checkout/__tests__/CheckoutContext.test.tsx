import { readFileSync } from 'fs';
import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { makeExecutableSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-common';
import { CheckoutValues, CheckoutStep, CheckoutProvider, Checkout, CheckoutRenderProps, CheckoutAddress } from '..';

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
      id: '10',
      referenceNo: '010'
    })
  }
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

type IRenderCheckout = (props?: {
  initialValues?: CheckoutValues;
  onStateUpdated?: (data: CheckoutRenderProps) => void;
}) => {
  getProps: () => CheckoutRenderProps;
  wrapper: ReactWrapper<any, any>;
};

describe('<Checkout/>', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let client: ApolloClient<any>;

  const renderCheckoutLogic: IRenderCheckout = ({ onStateUpdated, initialValues } = {}) => {
    let renderedProps: CheckoutRenderProps;
    wrapper = mount(
      <ApolloProvider client={client}>
        <CheckoutProvider initialValues={initialValues}>
          <Checkout>
            {logicData => {
              if (onStateUpdated) {
                onStateUpdated(logicData);
              }
              renderedProps = logicData;

              return <div />;
            }}
          </Checkout>
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

    it('should pass render props correctly to the render function', () => {
      const { getProps } = renderCheckoutLogic();
      expect(getProps().values).toBeDefined();
      expect(getProps().step).toEqual(CheckoutStep.Email);
    });

    it('should update email address when setEmail()', () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setEmail('foo@bar.com');
      expect(getProps().values.email).toBe('foo@bar.com');
      expect(getProps().step).toBe(CheckoutStep.ShippingAddress);
    });

    it('should properly set shipping address when address is passed to setShippingAddress()', () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setEmail('foo@bar.com');
      getProps().setShippingAddress(sampleAddress);

      expect(getProps().values.email).toBe('foo@bar.com');
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
      expect(getProps().values.billingAddress).toEqual(undefined);
      expect(getProps().values.shippingMethod).toEqual(undefined);
      expect(getProps().values.paymentMethod).toEqual(undefined);
      expect(getProps().step).toBe(CheckoutStep.BillingAddress);
    });

    it('should properly set billing address when address is passed to setBillingAddress()', () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setEmail('foo@bar.com');
      getProps().setBillingAddress(sampleAddress);

      expect(getProps().values.email).toBe('foo@bar.com');
      expect(getProps().values.shippingAddress).toEqual(undefined);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
      expect(getProps().values.shippingMethod).toEqual(undefined);
      expect(getProps().values.paymentMethod).toEqual(undefined);
      expect(getProps().step).toBe(CheckoutStep.ShippingAddress);
    });

    it('should properly set billing address when setShippingAddress() and isBillingSameAsShipping is true', () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setBillingSameAsShipping(true);
      getProps().setEmail('foo@bar.com');
      getProps().setShippingAddress(sampleAddress);

      expect(getProps().isBillingSameAsShipping).toBeTruthy();
      expect(getProps().values.email).toBe('foo@bar.com');
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
      expect(getProps().values.shippingMethod).toEqual(undefined);
      expect(getProps().values.paymentMethod).toEqual(undefined);
      expect(getProps().step).toBe(CheckoutStep.Shipping);
    });

    it('should properly set shipping method when setShippingMethod()', () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setBillingSameAsShipping(true);
      getProps().setEmail('foo@bar.com');
      getProps().setShippingAddress(sampleAddress);
      getProps().setShippingMethod(sampleShippingMethod);

      expect(getProps().isBillingSameAsShipping).toBeTruthy();
      expect(getProps().values.email).toBe('foo@bar.com');
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
      expect(getProps().values.shippingMethod).toEqual(sampleShippingMethod);
      expect(getProps().values.paymentMethod).toEqual(undefined);
      expect(getProps().step).toBe(CheckoutStep.Payment);
    });

    it('should properly set payment method when setPaymentMethod()', () => {
      const { getProps } = renderCheckoutLogic();
      getProps().setBillingSameAsShipping(true);
      getProps().setEmail('foo@bar.com');
      getProps().setShippingAddress(sampleAddress);
      getProps().setShippingMethod(sampleShippingMethod);
      getProps().setPaymentMethod(samplePaymentMethod);

      expect(getProps().isBillingSameAsShipping).toBeTruthy();
      expect(getProps().values.email).toBe('foo@bar.com');
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
      expect(getProps().values.shippingMethod).toEqual(sampleShippingMethod);
      expect(getProps().values.paymentMethod).toEqual(samplePaymentMethod);
      expect(getProps().step).toBe(CheckoutStep.Confirmation);
    });

    it('should not override OrderData when placeOrder() without arguments', () => {
      const { getProps } = renderCheckoutLogic();

      getProps().setBillingSameAsShipping(true);
      getProps().setEmail('foo@bar.com');
      getProps().setShippingAddress(sampleAddress);
      getProps().setShippingMethod(sampleShippingMethod);
      getProps().setPaymentMethod(samplePaymentMethod);
      getProps().setOrderData();

      expect(getProps().isBillingSameAsShipping).toBeTruthy();
      expect(getProps().values.email).toBe('foo@bar.com');
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
      expect(getProps().values.shippingMethod).toEqual(sampleShippingMethod);
      expect(getProps().values.paymentMethod).toEqual(samplePaymentMethod);
      expect(getProps().step).toBe(CheckoutStep.Confirmation);
    });

    it('should properly override OrderData when placeOrder() with arguments', () => {
      const { getProps } = renderCheckoutLogic();

      const overriddenPaymentMethod = { ...samplePaymentMethod, code: 'custom' };

      getProps().setBillingSameAsShipping(true);
      getProps().setEmail('foo@bar.com');
      getProps().setShippingAddress(sampleAddress);
      getProps().setShippingMethod(sampleShippingMethod);
      getProps().setPaymentMethod(samplePaymentMethod);
      getProps().setOrderData({
        email: 'foo@bar.co.uk',
        shippingAddress: sampleAddress,
        billingAddress: sampleAddress,
        shippingMethod: sampleShippingMethod,
        paymentMethod: overriddenPaymentMethod
      });

      expect(getProps().isBillingSameAsShipping).toBeTruthy();
      expect(getProps().values.email).toBe('foo@bar.co.uk');
      expect(getProps().values.shippingAddress).toEqual(sampleAddress);
      expect(getProps().values.billingAddress).toEqual(sampleAddress);
      expect(getProps().values.shippingMethod).toEqual(sampleShippingMethod);
      expect(getProps().values.paymentMethod).toEqual(overriddenPaymentMethod);
      expect(getProps().step).toBe(CheckoutStep.Confirmation);
    });
  });
});
