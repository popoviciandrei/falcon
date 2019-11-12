import React, { useState } from 'react';
import isEqual from 'lodash.isequal';
import { CheckoutDetailsInput } from '@deity/falcon-shop-extension';
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
import {
  CheckoutContext,
  CheckoutProviderRenderProps,
  CheckoutContextData,
  CheckoutContextValues
} from './CheckoutContext';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';

export type CheckoutProviderProps = {
  initialValues?: CheckoutContextValues;
  children(props: CheckoutProviderRenderProps): React.ReactNode;
};

export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues } = props;
  const [state, setState] = useState<CheckoutContextData>({
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
          ...(state.values.billingSameAsShipping && {
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
      const values = {} as CheckoutContextValues;
      // if shipping methods has changed then remove already selected shipping method
      if (!isEqual(data.shippingMethodList, state.availableShippingMethods)) {
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
      const values = {} as CheckoutContextValues;
      if (!isEqual(data.paymentMethodList, state.availablePaymentMethods)) {
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
    setState({
      // "deep replace" - replace old values with new, don't merge these
      ...state,
      ...partial,
      values: {
        ...state.values,
        ...(partial.values || {})
      }
    });
  };

  const setEmail = (email: string) => {
    if (email !== state.values.email) {
      setPartialState({ values: { email } });
    }
  };

  /**
   * @param {boolean} same Whether the billing address should be the same as shipping address
   */
  const setBillingSameAsShipping = (same: boolean) => {
    setPartialState({
      values: {
        billingSameAsShipping: same,
        billingAddress: same ? state.values.shippingAddress : null
      }
    });
    setBillingAddress(state.values.shippingAddress);
  };

  const setShippingAddress = (shippingAddress: CheckoutAddress) => {
    const values = { shippingAddress } as CheckoutContextValues;
    // if billing is set to the same as shipping then set it also to received value
    if (state.values.billingSameAsShipping) {
      values.billingAddress = shippingAddress;
    }
    setPartialState({ values, errors: {} });
    // setShippingAddressMutation({
    //   variables: { input: addressToCheckoutAddressInput(shippingAddress) }
    // });
  };

  const setBillingAddress = (billingAddress?: CheckoutAddress) => {
    setPartialState({
      values: {
        billingAddress: billingAddress || state.values.billingAddress
      }
    });
    setBillingAddressMutation({
      variables: {
        input: addressToCheckoutAddressInput(billingAddress || state.values.billingAddress)
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
          email: state.values.email,
          billingAddress: addressToCheckoutAddressInput(state.values.billingAddress),
          shippingAddress: addressToCheckoutAddressInput(state.values.shippingAddress),
          shippingMethod: state.values.shippingMethod,
          paymentMethod: state.values.paymentMethod
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
    ...state,
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
