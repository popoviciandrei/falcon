import React from 'react';
import { MutationFetchResult } from '@apollo/react-common';
import { withApollo, WithApolloClient } from '@apollo/react-hoc';
import isEqual from 'lodash.isequal';
import {
  PlaceOrderInput,
  PlaceOrderResult,
  CheckoutAddressInput,
  CheckoutDetailsInput,
  SetCheckoutAddressInput,
  SetCheckoutDetailsInput,
  ShippingMethod,
  PaymentMethod
} from '@deity/falcon-shop-extension';
import {
  // Step 1
  SET_SHIPPING_ADDRESS,
  SetShippingAddressResponse,
  // Step 2
  SET_BILLING_ADDRESS,
  SetBillingAddressResponse,
  // Step 3
  SHIPPING_METHOD_LIST,
  ShippingMethodListResponse,
  // Step 4
  SET_SHIPPING_METHOD,
  SetShippingMethodResponse,
  // Step 5
  PAYMENT_METHOD_LIST,
  PaymentMethodListResponse,
  // Step 6
  SET_PAYMENT_METHOD,
  SetPaymentMethodResponse,
  // Step 7
  PLACE_ORDER,
  PlaceOrderResponse
} from '@deity/falcon-shop-data';

export type CheckoutLogicData = {
  email?: string;
  shippingAddress: CheckoutAddressInput;
  billingAddress?: CheckoutAddressInput;
  billingSameAsShipping?: boolean;
  shippingMethod?: CheckoutDetailsInput;
  paymentMethod?: CheckoutDetailsInput;
};

type CheckoutLogicError = {
  message: string;
};

type CheckoutLogicState = {
  loading: boolean;
  errors: CheckoutLogicErrors;
  values: CheckoutLogicData;
  result?: PlaceOrderResult;
  availableShippingMethods: ShippingMethod[];
  availablePaymentMethods: PaymentMethod[];
};

type CheckoutLogicErrors = {
  email?: CheckoutLogicError[];
  shippingAddress?: CheckoutLogicError[];
  billingSameAsShipping?: CheckoutLogicError[];
  billingAddress?: CheckoutLogicError[];
  shippingMethod?: CheckoutLogicError[];
  paymentMethod?: CheckoutLogicError[];
  order?: CheckoutLogicError[];
};

export type CheckoutLogicRenderProps = {
  setEmail(email: string): void;
  setShippingAddress(address: CheckoutAddressInput): void;
  setBillingSameAsShipping(same: boolean): void;
  setBillingAddress(address: CheckoutAddressInput): void;
  setShippingMethod(shipping: CheckoutDetailsInput): void;
  setPaymentMethod(payment: CheckoutDetailsInput): void;
  placeOrder(): void;
} & CheckoutLogicState;

export type CheckoutLogicProps = WithApolloClient<{
  initialValues?: CheckoutLogicData;
  children(props: CheckoutLogicRenderProps): React.ReactNode;
}>;
class CheckoutLogicInner extends React.Component<CheckoutLogicProps, CheckoutLogicState> {
  constructor(props: CheckoutLogicProps) {
    super(props);
    this.state = {
      loading: false,
      values: props.initialValues || ({ billingSameAsShipping: false } as any),
      errors: {},
      availablePaymentMethods: [],
      availableShippingMethods: []
    };
  }

  setPartialState(partial: any, callback?: () => void) {
    this.setState(
      state =>
        // "deep replace" - replace old values with new, don't merge these
        ({
          ...state,
          ...partial,
          values: {
            ...state.values,
            ...(partial.values || {})
          }
        }),
      callback
    );
  }

  setLoading(loading: boolean, callback?: () => void) {
    this.setPartialState({ loading }, callback);
  }

  setEmail = (email: string) =>
    this.setLoading(true, () => this.setPartialState({ loading: false, values: { email } }));

  // the following setters first set loading to true, and then in the callback actual values is set
  // and loading flag gets reset to false, so the flow goes through whole process (loading > set value > loaded)
  setBillingSameAsShipping = (same: boolean) =>
    this.setLoading(true, () =>
      this.setPartialState({
        loading: false,
        values: {
          billingSameAsShipping: same,
          billingAddress: same ? this.state.values.shippingAddress : null
        }
      })
    );

  setShippingAddress = (shippingAddress: CheckoutAddressInput) =>
    this.setLoading(true, () => {
      // trigger mutation that will return available shipping options
      this.props.client
        .mutate<SetShippingAddressResponse, SetCheckoutAddressInput>({
          mutation: SET_SHIPPING_ADDRESS,
          variables: { input: shippingAddress }
        })
        .then(({ errors }) => {
          if (errors) {
            this.setPartialState({
              loading: false,
              errors: { shippingAddress: errors },
              availableShippingMethods: []
            });
          } else {
            const values = { shippingAddress } as CheckoutLogicData;

            // if billing is set to the same as shipping then set it also to received value
            if (this.state.values.billingSameAsShipping) {
              values.billingAddress = shippingAddress;
            }
          }
        })
        .catch(error => {
          this.setPartialState({
            loading: false,
            errors: { shippingAddress: [error] }
          });
        });
    });

  setBillingAddress = (billingAddress?: CheckoutAddressInput) =>
    this.setLoading(true, () => {
      if (billingAddress) {
        this.setPartialState({ errors: {}, values: { billingAddress } });
      }
      this.props.client
        .mutate<SetBillingAddressResponse, SetCheckoutAddressInput>({
          mutation: SET_BILLING_ADDRESS,
          variables: {
            input: this.state.values.billingAddress
          }
        })
        .then(({ errors }) => {
          if (errors) {
            this.setPartialState({
              loading: false,
              errors: { billingAddress: errors },
              availableShippingMethods: []
            });
          } else {
            return this.props.client
              .query<ShippingMethodListResponse>({
                query: SHIPPING_METHOD_LIST
              })
              .then(({ errors: queryErrors, data }) => {
                if (queryErrors) {
                  this.setPartialState({
                    loading: false,
                    errors: { shippingMethod: queryErrors }
                  });
                } else {
                  const values = {} as CheckoutLogicData;
                  // if shipping methods has changed then remove already selected shipping method
                  if (!isEqual(data.shippingMethodList, this.state.availableShippingMethods)) {
                    values.shippingMethod = null;
                  }

                  this.setPartialState({
                    loading: false,
                    errors: {},
                    values,
                    availableShippingMethods: data.shippingMethodList
                  });
                }
              });
          }
        });
    });

  setShippingMethod = (shippingMethod: CheckoutDetailsInput) =>
    this.setLoading(true, () => {
      this.props.client
        .mutate<SetShippingMethodResponse, SetCheckoutDetailsInput>({
          mutation: SET_SHIPPING_METHOD,
          // refetch cart because totals have changed once shipping has been selected
          refetchQueries: ['Cart'],
          variables: {
            input: shippingMethod
          }
        })
        .then(({ errors }) => {
          if (errors) {
            this.setPartialState({
              loading: false,
              errors: { shippingMethod: errors },
              availablePaymentMethods: []
            });
          } else {
            return this.props.client
              .query<PaymentMethodListResponse>({
                query: PAYMENT_METHOD_LIST
              })
              .then(({ errors: queryErrors, data }) => {
                if (queryErrors) {
                  this.setPartialState({
                    loading: false,
                    errors: { paymentMethod: queryErrors }
                  });
                } else {
                  const values = { shippingMethod } as CheckoutLogicData;

                  // if available payment methods has changed then remove selected payment method
                  if (!isEqual(data.paymentMethodList, this.state.availablePaymentMethods)) {
                    values.paymentMethod = null;
                  }

                  this.setPartialState({
                    loading: false,
                    errors: {},
                    values,
                    availablePaymentMethods: data.paymentMethodList
                  });
                }
              });
          }
        })
        .catch(error => {
          this.setPartialState({
            loading: false,
            errors: { shippingMethod: [error] }
          });
        });
    });

  setPaymentMethod = (paymentMethod: CheckoutDetailsInput) =>
    this.setLoading(true, () => {
      this.props.client
        .mutate<SetPaymentMethodResponse, SetCheckoutDetailsInput>({
          mutation: SET_PAYMENT_METHOD,
          // refetch cart because totals have changed once payment has been selected
          refetchQueries: ['Cart'],
          variables: {
            input: paymentMethod
          }
        })
        .then(({ errors }) => {
          if (errors) {
            this.setPartialState({
              loading: false,
              errors: { paymentMethod: errors }
            });
          } else {
            this.setPartialState({
              loading: false,
              values: {
                paymentMethod
              }
            });
          }
        })
        .catch(error => {
          this.setPartialState({
            loading: false,
            errors: { paymentMethod: [error] }
          });
        });
    });

  placeOrder = () => {
    const handleResponse = ({
      data,
      errors
    }: MutationFetchResult<PlaceOrderResponse, Record<string, any>, Record<string, any>>) => {
      if (errors) {
        this.setPartialState({
          loading: false,
          errors: {
            order: errors
          }
        });
      } else {
        this.setPartialState({
          loading: false,
          error: null,
          result: data.placeOrder
        });
      }
    };

    this.setLoading(true, () => {
      this.props.client
        .mutate<PlaceOrderResponse, PlaceOrderInput>({
          mutation: PLACE_ORDER,
          // update cart once order is placed successfully
          refetchQueries: ['Cart', 'OrderList'],
          variables: {
            input: {
              billingAddress: this.state.values.billingAddress,
              shippingAddress: this.state.values.shippingAddress,
              shippingMethod: this.state.values.shippingMethod,
              paymentMethod: this.state.values.paymentMethod
            }
          }
        })
        // promise catches the errors which are not passed to update callback
        .then(handleResponse)
        .catch(error => handleResponse({ errors: [error] }));
    });
  };

  render() {
    return this.props.children({
      loading: this.state.loading,
      values: this.state.values,
      errors: this.state.errors,
      result: this.state.result,
      availablePaymentMethods: this.state.availablePaymentMethods,
      availableShippingMethods: this.state.availableShippingMethods,
      setEmail: this.setEmail,
      setShippingAddress: this.setShippingAddress,
      setBillingAddress: this.setBillingAddress,
      setBillingSameAsShipping: this.setBillingSameAsShipping,
      setShippingMethod: this.setShippingMethod,
      setPaymentMethod: this.setPaymentMethod,
      placeOrder: this.placeOrder
    });
  }
}

export const CheckoutLogic = withApollo(CheckoutLogicInner);
