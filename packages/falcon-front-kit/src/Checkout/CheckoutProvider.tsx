import React, { createContext, useContext, useState, useEffect } from 'react';
import isEqual from 'lodash.isequal';
import {
  PlaceOrderResult,
  CheckoutAddressInput,
  CheckoutDetailsInput,
  ShippingMethod,
  PaymentMethod
} from '@deity/falcon-shop-extension';
import {
  // Step 1
  useSetShippingAddressMutation,
  // Step 2
  useSetBillingAddressMutation,
  // Step 3
  useShippingMethodListLazyQuery,
  // Step 4
  useSetShippingMethodMutation,
  // Step 5
  usePaymentMethodListLazyQuery,
  // Step 6
  useSetPaymentMethodMutation,
  // Step 7
  usePlaceOrderMutation
} from '@deity/falcon-shop-data';
import { CheckoutContext, CheckoutProviderRenderProps, CheckoutContextData, CheckoutState } from './CheckoutContext';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';

export type CheckoutProviderProps = {
  initialValues?: CheckoutState;
  children(props: CheckoutProviderRenderProps): React.ReactNode;
};

export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues } = props;

  const [contextData, setContextData] = useState<CheckoutContextData>({
    values: {
      billingSameAsShipping: false,
      ...initialValues
    },
    errors: {},
    availablePaymentMethods: [],
    availableShippingMethods: []
  });
  const [setShippingAddressMutation, { loading: setShippingAddressLoading }] = useSetShippingAddressMutation({
    onError: error => {
      setPartialState({
        errors: { shippingAddress: [error] },
        values: {
          shippingAddress: null,
          ...(contextData.values.billingSameAsShipping && {
            billingAddress: null
          })
        },
        availableShippingMethods: []
      });
    },
    onCompleted: data => {
      if (data.setShippingAddress) {
        setPartialState({ errors: {} });
      }
    }
  });
  const [setBillingAddressMutation, { loading: setBillingAddressLoading }] = useSetBillingAddressMutation({
    onError: error => {
      setPartialState({
        errors: { billingAddress: [error] },
        values: { billingAddress: null },
        availableShippingMethods: []
      });
    },
    onCompleted: data => {
      if (data.setBillingAddress) {
        setPartialState({ errors: {} });
        if (shippingMethodListProps.refetch) {
          shippingMethodListProps.refetch();
        } else {
          loadShippingMethodList();
        }
      }
    }
  });
  const [loadShippingMethodList, shippingMethodListProps] = useShippingMethodListLazyQuery({
    onError: error => {
      setPartialState({
        errors: { shippingMethod: [error] },
        availableShippingMethods: []
      });
    },
    onCompleted: data => {
      const values = {} as CheckoutState;
      // if shipping methods has changed then remove already selected shipping method
      if (!isEqual(data.shippingMethodList, contextData.availableShippingMethods)) {
        values.shippingMethod = null;
      }

      setPartialState({
        errors: {},
        values,
        availableShippingMethods: data.shippingMethodList
      });
    }
  });
  const [setShippingMethodMutation, { loading: setShippingMethodLoading }] = useSetShippingMethodMutation({
    onError: error => {
      setPartialState({
        errors: { shippingMethod: [error] },
        availablePaymentMethods: null,
        values: { shippingMethod: null }
      });
    },
    onCompleted: data => {
      if (data.setShippingMethod) {
        setPartialState({ errors: {} });
        if (paymentMethodListProps.refetch) {
          paymentMethodListProps.refetch();
        } else {
          loadPaymentMethodList();
        }
      }
    }
  });
  const [loadPaymentMethodList, paymentMethodListProps] = usePaymentMethodListLazyQuery({
    onError: error => {
      setPartialState({
        errors: { paymentMethod: [error] },
        availablePaymentMethods: []
      });
    },
    onCompleted: data => {
      const values = {} as CheckoutState;
      if (!isEqual(data.paymentMethodList, contextData.availablePaymentMethods)) {
        values.paymentMethod = null;
      }

      setPartialState({
        errors: {},
        values,
        availablePaymentMethods: data.paymentMethodList
      });
    }
  });
  const [setPaymentMethodMutation, { loading: setPaymentMethodLoading }] = useSetPaymentMethodMutation({
    onError: error => {
      setPartialState({
        errors: { paymentMethod: [error] },
        values: { paymentMethod: null }
      });
    },
    onCompleted: () => {
      setPartialState({ errors: {} });
    }
  });
  const [placeOrderMutation, { loading: placeOrderLoading }] = usePlaceOrderMutation({
    onError: error => {
      setPartialState({ errors: { order: [error] } });
    },
    onCompleted: data => {
      setPartialState({
        errors: {},
        result: data.placeOrder
      });
    }
  });

  const setPartialState = (partial: Partial<CheckoutContextData>) => {
    setContextData({
      // "deep replace" - replace old values with new, don't merge these
      ...contextData,
      ...partial,
      values: {
        ...contextData.values,
        ...(partial.values || {})
      }
    });
  };

  const setEmail = (email: string) => setPartialState({ values: { email } });

  /**
   * @param {boolean} same Whether the billing address should be the same as shipping address
   */
  const setBillingSameAsShipping = (same: boolean) => {
    setPartialState({
      values: {
        billingSameAsShipping: same,
        billingAddress: same ? contextData.values.shippingAddress : null
      }
    });
    setBillingAddress(contextData.values.shippingAddress);
  };

  const setShippingAddress = (shippingAddress: CheckoutAddress) => {
    const values = { shippingAddress } as CheckoutState;
    // if billing is set to the same as shipping then set it also to received value
    if (contextData.values.billingSameAsShipping) {
      values.billingAddress = shippingAddress;
    }
    setPartialState({ values });
    setShippingAddressMutation({
      variables: { input: addressToCheckoutAddressInput(shippingAddress) }
    });
  };

  const setBillingAddress = (billingAddress?: CheckoutAddress) => {
    setPartialState({
      values: {
        billingAddress: billingAddress || contextData.values.billingAddress
      }
    });
    setBillingAddressMutation({
      variables: {
        input: addressToCheckoutAddressInput(billingAddress || contextData.values.billingAddress)
      }
    });
  };

  const setShippingMethod = (shippingMethod: CheckoutDetailsInput) => {
    setPartialState({ values: { shippingMethod } });
    setShippingMethodMutation({ variables: { input: shippingMethod } });
  };

  const setPaymentMethod = (paymentMethod: CheckoutDetailsInput) => {
    setPartialState({ values: { paymentMethod } });
    setPaymentMethodMutation({ variables: { input: paymentMethod } });
  };

  const placeOrder = (/** TODO: I would like to pass all necessary date here to do 1 click checkout */) => {
    placeOrderMutation({
      variables: {
        input: {
          email: contextData.values.email,
          billingAddress: addressToCheckoutAddressInput(contextData.values.billingAddress),
          shippingAddress: addressToCheckoutAddressInput(contextData.values.shippingAddress),
          shippingMethod: contextData.values.shippingMethod,
          paymentMethod: contextData.values.paymentMethod
        }
      }
    });
  };

  // Avoiding manual "loading" state key manipulation,
  // so using Query's/Mutation's "loading" flags instead
  const isLoading =
    [
      setShippingAddressLoading,
      setBillingAddressLoading,
      shippingMethodListProps.loading,
      setShippingMethodLoading,
      paymentMethodListProps.loading,
      setPaymentMethodLoading,
      placeOrderLoading
    ].filter(Boolean).length > 0;

  const context: CheckoutProviderRenderProps = {
    ...contextData,
    loading: isLoading,
    setEmail,
    setBillingSameAsShipping,
    setShippingAddress,
    setBillingAddress,
    setShippingMethod,
    setPaymentMethod,
    placeOrder
  };

  return <CheckoutContext.Provider value={context}>{children}</CheckoutContext.Provider>;
};
