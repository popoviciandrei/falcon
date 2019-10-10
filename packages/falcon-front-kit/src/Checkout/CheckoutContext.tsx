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
  loading: boolean;
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
    loading: false,
    values: { billingSameAsShipping: false },
    errors: {},
    availablePaymentMethods: [],
    availableShippingMethods: []
  });
  const [setShippingAddressMutation] = useSetShippingAddressMutation();
  const [setBillingAddressMutation] = useSetBillingAddressMutation();
  const [
    loadShippingMethodList,
    {
      data: shippingMethodListData,
      called: shippingMethodListCalled,
      error: shippingMethodListError,
      loading: shippingMethodListLoading,
      refetch: shippingMethodListRefetch
    }
  ] = useShippingMethodListLazyQuery();
  const [setShippingMethodMutation] = useSetShippingMethodMutation();
  const [
    loadPaymentMethodList,
    {
      data: paymentMethodListData,
      called: paymentMethodListCalled,
      error: paymentMethodListError,
      loading: paymentMethodListLoading,
      refetch: paymentMethodListRefetch
    }
  ] = usePaymentMethodListLazyQuery();
  const [setPaymentMethodMutation] = useSetPaymentMethodMutation();
  const [placeOrderMutation] = usePlaceOrderMutation();

  // Handling useShippingMethodListLazyQuery hook
  useEffect(() => {
    if (!shippingMethodListCalled) return;
    if (shippingMethodListError) {
      setPartialState({
        loading: false,
        errors: { shippingMethod: [shippingMethodListError] },
        availableShippingMethods: []
      });
      return;
    }
    if (shippingMethodListData && shippingMethodListData.shippingMethodList) {
      const values = {} as CheckoutContextValues;
      // if shipping methods has changed then remove already selected shipping method
      if (!isEqual(shippingMethodListData.shippingMethodList, state.availableShippingMethods)) {
        values.shippingMethod = null;
      }

      setPartialState({
        loading: false,
        errors: {},
        values,
        availableShippingMethods: shippingMethodListData.shippingMethodList
      });
    }
  }, [shippingMethodListLoading]);

  // Handling usePaymentMethodListLazyQuery hook
  useEffect(() => {
    if (!paymentMethodListCalled) return;
    if (paymentMethodListError) {
      setPartialState({
        loading: false,
        errors: { paymentMethod: [paymentMethodListError] },
        availablePaymentMethods: []
      });
      return;
    }
    if (paymentMethodListData && paymentMethodListData.paymentMethodList) {
      const values = {} as CheckoutContextValues;
      if (!isEqual(paymentMethodListData.paymentMethodList, state.availablePaymentMethods)) {
        values.paymentMethod = null;
      }

      setPartialState({
        loading: false,
        errors: {},
        values,
        availablePaymentMethods: paymentMethodListData.paymentMethodList
      });
    }
  }, [paymentMethodListLoading]);

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

  const setLoading = (loading: boolean = true) => setPartialState({ loading });

  const setEmail = (email: string) => setPartialState({ values: { email } });

  /**
   * the following setters first set loading to true, and then in the callback actual values is set
   * and loading flag gets reset to false, so the flow goes through whole process (loading > set value > loaded)
   * @param {boolean} same Whether the billing address should be the same as shipping address
   */
  const setBillingSameAsShipping = (same: boolean) => {
    setPartialState({
      loading: true,
      values: {
        billingSameAsShipping: same,
        billingAddress: same ? state.values.shippingAddress : null
      }
    });

    setBillingAddress(state.values.shippingAddress);
  };

  const setShippingAddress = (shippingAddress: CheckoutAddressInput) => {
    setLoading();
    setShippingAddressMutation({
      variables: { input: shippingAddress }
    })
      .then(({ errors }) => {
        if (errors) {
          setPartialState({
            loading: false,
            errors: { shippingAddress: errors },
            availableShippingMethods: null
          });
          return;
        }

        const values = { shippingAddress } as CheckoutContextValues;

        // if billing is set to the same as shipping then set it also to received value
        if (state.values.billingSameAsShipping) {
          values.billingAddress = shippingAddress;
        }
        setPartialState({
          errors: {},
          values
        });
      })
      .catch(error => {
        setPartialState({
          loading: false,
          errors: { shippingAddress: [error] }
        });
      });
  };

  const setBillingAddress = (billingAddress?: CheckoutAddressInput) => {
    setLoading();
    setBillingAddressMutation({
      variables: {
        input: billingAddress || state.values.billingAddress
      }
    }).then(({ errors }) => {
      if (errors) {
        setPartialState({
          loading: false,
          errors: { billingAddress: errors },
          availableShippingMethods: []
        });
        return;
      }
      setPartialState({
        errors: {},
        values: {
          billingAddress: billingAddress || state.values.billingAddress
        }
      });
      if (shippingMethodListRefetch) {
        shippingMethodListRefetch();
      } else {
        loadShippingMethodList();
      }
    });
  };

  const setShippingMethod = (shippingMethod: CheckoutDetailsInput) => {
    setLoading();
    setShippingMethodMutation({
      variables: {
        input: shippingMethod
      }
    })
      .then(({ errors }) => {
        if (errors) {
          setPartialState({
            loading: false,
            errors: { shippingMethod: errors },
            availablePaymentMethods: []
          });
          return;
        }
        setPartialState({
          loading: false,
          errors: {},
          values: {
            shippingMethod
          }
        });
        if (paymentMethodListRefetch) {
          paymentMethodListRefetch();
        } else {
          loadPaymentMethodList();
        }
      })
      .catch(error => {
        setPartialState({
          loading: false,
          errors: { shippingMethod: [error] }
        });
      });
  };

  const setPaymentMethod = (paymentMethod: CheckoutDetailsInput) => {
    setLoading();
    setPaymentMethodMutation({
      variables: {
        input: paymentMethod
      }
    })
      .then(({ errors }) => {
        if (errors) {
          setPartialState({
            loading: false,
            errors: { paymentMethod: errors }
          });
          return;
        }
        setPartialState({
          loading: false,
          errors: {},
          values: {
            paymentMethod
          }
        });
      })
      .catch(error => {
        setPartialState({
          loading: false,
          errors: { paymentMethod: [error] }
        });
      });
  };

  const placeOrder = () => {
    setLoading();
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
    })
      .then(({ data, errors }) => {
        if (errors) {
          setPartialState({
            loading: false,
            errors: {
              order: errors
            }
          });
          return;
        }
        setPartialState({
          loading: false,
          errors: {},
          result: data.placeOrder
        });
      })
      .catch(error => {
        setPartialState({
          loading: false,
          errors: {
            order: [error]
          }
        });
      });
  };

  const context: CheckoutProviderRenderProps = {
    ...state,
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
