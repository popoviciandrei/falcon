import React from 'react';
import { MutationFetchResult } from '@apollo/react-common';
import { withApollo, WithApolloClient } from '@apollo/react-hoc';
import isEqual from 'lodash.isequal';
import { OperationInput } from '@deity/falcon-data';
import {
  PlaceOrderInput,
  PlaceOrderResult,
  CheckoutAddressInput,
  EstimateShippingMethodsInput,
  ShippingMethod,
  SetShippingInput,
  PaymentMethod
} from '@deity/falcon-shop-extension';
import {
  PLACE_ORDER,
  PlaceOrderResponse,
  ESTIMATE_SHIPPING_METHODS,
  EstimateShippingMethodsResponse,
  SET_SHIPPING,
  SetShippingResponse
} from '@deity/falcon-shop-data';

type CheckoutLogicData = {
  email: string | null;
  shippingAddress: CheckoutAddressInput | null;
  billingAddress: CheckoutAddressInput | null;
  billingSameAsShipping: boolean | null;
  shippingMethod: ShippingMethod | null;
  paymentMethod: PaymentMethod | null;
  paymentAdditionalData: object | null;
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
  values: CheckoutLogicData;
  errors: CheckoutLogicErrors;
  loading: boolean;
  availableShippingMethods: ShippingMethod[];
  availablePaymentMethods: PaymentMethod[];
  result?: PlaceOrderResult;
  setEmail(email: string): void;
  setShippingAddress(address: CheckoutAddressInput): void;
  setBillingSameAsShipping(same: boolean): void;
  setBillingAddress(address: CheckoutAddressInput): void;
  setShippingMethod(shipping: ShippingMethod): void;
  setPaymentMethod(payment: PaymentMethod, additionalData?: any): void;
  placeOrder(): void;
};

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

  getShippingMethodData(shippingMethod: ShippingMethod) {
    return {
      shippingCarrierCode: shippingMethod.carrierCode,
      shippingMethodCode: shippingMethod.methodCode
    };
  }

  setEmail = (email: string) =>
    this.setLoading(true, () => this.setPartialState({ loading: false, values: { email } }));

  // the following setters first set loading to true, and then in the callback actual values is set
  // and loading flag gets reset to false, so the flow goes through whole proces (loading > set value > loaded)
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

  setBillingAddress = (billingAddress: CheckoutAddressInput) =>
    this.setLoading(true, () => this.setPartialState({ loading: false, values: { billingAddress } }));

  setPaymentMethod = (paymentMethod: PaymentMethod, additionalData?: any) =>
    this.setLoading(true, () =>
      this.setPartialState({ loading: false, values: { paymentMethod, paymentAdditionalData: additionalData } })
    );

  setShippingAddress = (shippingAddress: CheckoutAddressInput) => {
    this.setLoading(true, () => {
      // trigger mutation that will return available shipping options
      this.props.client
        .mutate<EstimateShippingMethodsResponse, OperationInput<EstimateShippingMethodsInput>>({
          mutation: ESTIMATE_SHIPPING_METHODS,
          variables: { input: { address: shippingAddress } }
        })
        .then(({ errors, data }) => {
          if (errors) {
            this.setPartialState({
              loading: false,
              errors: { shippingAddress: errors },
              availableShippingMethods: null
            });
          } else {
            const values = { shippingAddress } as CheckoutLogicData;

            // if billing is set to the same as shipping then set it also to received value
            if (this.state.values.billingSameAsShipping) {
              values.billingAddress = shippingAddress;
            }

            // if shipping methods has changed then remove already selected shipping method
            if (!isEqual(data.estimateShippingMethods, this.state.availableShippingMethods)) {
              values.shippingMethod = null;
            }

            this.setPartialState({
              loading: false,
              errors: {},
              values,
              availableShippingMethods: data.estimateShippingMethods
            });
          }
        })
        .catch(error => {
          this.setPartialState({
            loading: false,
            errors: { shippingAddress: [error] }
          });
        });
    });
  };

  setShippingMethod = (shippingMethod: ShippingMethod) => {
    this.setLoading(true, () => {
      // trigger mutation that will return available payment options
      this.props.client
        .mutate<SetShippingResponse, OperationInput<SetShippingInput>>({
          mutation: SET_SHIPPING,
          // refetch cart because totals have changed once shipping has been selected
          refetchQueries: ['Cart'],
          variables: {
            input: {
              billingAddress: this.state.values.billingAddress,
              shippingAddress: this.state.values.shippingAddress,
              ...this.getShippingMethodData(shippingMethod)
            }
          }
        })
        .then(({ errors, data }) => {
          if (errors) {
            this.setPartialState({
              loading: false,
              errors: { shippingMethod: errors },
              availablePaymentMethods: []
            });
          } else {
            const values = { shippingMethod } as CheckoutLogicData;
            // if available payment methods has changed then remove selected payment method
            if (!isEqual(data.setShipping.paymentMethods, this.state.availablePaymentMethods)) {
              values.paymentMethod = null;
            }

            this.setPartialState({
              loading: false,
              errors: {},
              values,
              availablePaymentMethods: data.setShipping.paymentMethods
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
  };

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
        .mutate<PlaceOrderResponse, OperationInput<PlaceOrderInput>>({
          mutation: PLACE_ORDER,
          // update cart once order is placed successfully
          refetchQueries: ['Cart', 'OrderList'],
          variables: {
            input: {
              email: this.state.values.email,
              billingAddress: this.state.values.billingAddress,
              paymentMethod: {
                method: this.state.values.paymentMethod!.code,
                additionalData: this.state.values.paymentAdditionalData
              }
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
