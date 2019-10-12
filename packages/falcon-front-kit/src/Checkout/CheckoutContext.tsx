import React, { createContext, useContext, useState } from 'react';
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

type CheckoutContextValues = {
  email?: string;
  shippingAddress?: CheckoutAddressInput;
  billingAddress?: CheckoutAddressInput;
  billingSameAsShipping?: boolean;
  shippingMethod?: CheckoutDetailsInput;
  paymentMethod?: CheckoutDetailsInput;
};

type CheckoutContextError = {
  message: string;
};

type CheckoutContextData = {
  errors: CheckoutContextErrors;
  values: CheckoutContextValues;
  result?: PlaceOrderResult;
  availableShippingMethods: ShippingMethod[];
  availablePaymentMethods: PaymentMethod[];
};

type CheckoutContextErrors = {
  email?: CheckoutContextError[];
  shippingAddress?: CheckoutContextError[];
  billingSameAsShipping?: CheckoutContextError[];
  billingAddress?: CheckoutContextError[];
  shippingMethod?: CheckoutContextError[];
  paymentMethod?: CheckoutContextError[];
  order?: CheckoutContextError[];
};

export type CheckoutProviderRenderProps = {
  loading: boolean;
  setEmail(email: string): void;
  setShippingAddress(address: CheckoutAddressInput): void;
  setBillingSameAsShipping(same: boolean): void;
  setBillingAddress(address: CheckoutAddressInput): void;
  setShippingMethod(shipping: CheckoutDetailsInput): void;
  setPaymentMethod(payment: CheckoutDetailsInput): void;
  placeOrder(): void;
} & CheckoutContextData;

export type CheckoutProviderProps = {
  initialValues?: CheckoutContextValues;
  children(props: CheckoutProviderRenderProps): React.ReactNode;
};

export type PartialType = Partial<CheckoutContextData>;

export const CheckoutContext = createContext<Partial<CheckoutProviderRenderProps>>({});

export const CheckoutProvider = (props: CheckoutProviderProps) => {
  const { children } = props;
  const [state, setState] = useState<CheckoutContextData>({
    values: { billingSameAsShipping: false },
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

  const setPartialState = (partial: PartialType) => {
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

  const setEmail = (email: string) => setPartialState({ values: { email } });

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

  const setShippingAddress = (shippingAddress: CheckoutAddressInput) => {
    const values = { shippingAddress } as CheckoutContextValues;
    // if billing is set to the same as shipping then set it also to received value
    if (state.values.billingSameAsShipping) {
      values.billingAddress = shippingAddress;
    }
    setPartialState({ values });
    setShippingAddressMutation({
      variables: { input: shippingAddress }
    });
  };

  const setBillingAddress = (billingAddress?: CheckoutAddressInput) => {
    setPartialState({
      values: {
        billingAddress: billingAddress || state.values.billingAddress
      }
    });
    setBillingAddressMutation({
      variables: {
        input: billingAddress || state.values.billingAddress
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

  const placeOrder = () => {
    placeOrderMutation({
      variables: {
        input: {
          email: state.values.email,
          billingAddress: state.values.billingAddress,
          shippingAddress: state.values.shippingAddress,
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
    ].filter(v => v).length > 0;

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

export const { Consumer: CheckoutConsumer } = CheckoutContext;

export const useCheckoutContext = () => useContext(CheckoutContext);
