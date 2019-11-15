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
import { CheckoutContext, CheckoutProviderRenderProps, CheckoutContextData } from './CheckoutContext';
import { CheckoutState } from './CheckoutState';
import { CheckoutAddress, addressToCheckoutAddressInput } from './CheckoutAddress';

export type CheckoutProviderProps = {
  initialValues?: CheckoutState;
  children(props: CheckoutProviderRenderProps): React.ReactNode;
};

export const CheckoutProvider: React.SFC<CheckoutProviderProps> = props => {
  const { children, initialValues } = props;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<CheckoutState>({
    billingSameAsShipping: false,
    ...initialValues
  });

  const [contextData, setContextData] = useState<CheckoutContextData>({
    errors: {},
    availablePaymentMethods: [],
    availableShippingMethods: []
  });
  const [setShippingAddressMutation, { loading: setShippingAddressLoading }] = useSetShippingAddressMutation({
    onError: error => {
      setPartialState({
        errors: { shippingAddress: [error] },
        availableShippingMethods: []
      });
      setState({
        ...state,
        ...{
          shippingAddress: undefined,
          ...(state.billingSameAsShipping && {
            billingAddress: undefined
          })
        }
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
        availableShippingMethods: []
      });
      setState({
        ...state,
        billingAddress: undefined
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
      const values: Partial<CheckoutState> = {};
      // if shipping methods has changed then remove already selected shipping method
      if (!isEqual(data.shippingMethodList, contextData.availableShippingMethods)) {
        values.shippingMethod = undefined;
      }

      setPartialState({
        errors: {},
        availableShippingMethods: data.shippingMethodList
      });
      setState({
        ...state,
        ...values
      });
    }
  });
  const [setShippingMethodMutation, { loading: setShippingMethodLoading }] = useSetShippingMethodMutation({
    onError: error => {
      setPartialState({
        errors: { shippingMethod: [error] },
        availablePaymentMethods: null
      });
      setState({
        ...state,
        shippingAddress: undefined
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
      const values: Partial<CheckoutState> = {};
      if (!isEqual(data.paymentMethodList, contextData.availablePaymentMethods)) {
        values.paymentMethod = undefined;
      }

      setPartialState({
        errors: {},
        availablePaymentMethods: data.paymentMethodList
      });
      setState({
        ...state,
        ...values
      });
    }
  });
  const [setPaymentMethodMutation, { loading: setPaymentMethodLoading }] = useSetPaymentMethodMutation({
    onError: error => {
      setPartialState({
        errors: { paymentMethod: [error] }
      });
      setState({
        ...state,
        paymentMethod: undefined
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
      ...partial
    });
  };

  const setEmail = email => setState(x => (x.email === email ? x : { ...x, email }));

  /** @param {boolean} same Whether the billing address should be the same as shipping address */
  const setBillingSameAsShipping = (same: boolean) => {
    // setState({
    //   ...state,
    //   billingSameAsShipping: same,
    //   billingAddress: same ? state.shippingAddress : null
    // });
    // setBillingAddress(state.shippingAddress);
  };

  const setShippingAddress = shippingAddress =>
    setState(x =>
      isEqual(x.shippingAddress, shippingAddress)
        ? x
        : {
            ...x,
            shippingAddress,
            // billingAddress: state.billingSameAsShipping ? shippingAddress : state.billingAddress
            shippingMethod: undefined,
            paymentMethod: undefined
          }
    );

  const setBillingAddress = billingAddress =>
    setState(x =>
      isEqual(x.billingAddress, billingAddress)
        ? x
        : {
            ...x,
            billingAddress,
            paymentMethod: undefined
          }
    );

  const setShippingMethod = shippingMethod =>
    setState(x =>
      isEqual(x.shippingMethod, shippingMethod)
        ? x
        : {
            ...x,
            shippingMethod,
            paymentMethod: undefined
          }
    );

  const setPaymentMethod = paymentMethod =>
    setState(x => (isEqual(x.paymentMethod, paymentMethod) ? x : { ...x, paymentMethod }));

  const placeOrder = (/** TODO: I would like to pass all necessary date here to do 1 click checkout */) => {
    placeOrderMutation({
      variables: {
        input: {
          email: state.email,
          billingAddress: addressToCheckoutAddressInput(state.billingAddress),
          shippingAddress: addressToCheckoutAddressInput(state.shippingAddress),
          shippingMethod: state.shippingMethod,
          paymentMethod: state.paymentMethod
        }
      }
    });
  };

  const context: CheckoutProviderRenderProps = {
    values: state,
    isLoading,
    setLoading,
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
