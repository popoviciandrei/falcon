import React, { useState, useContext } from 'react';
import isEqual from 'lodash.isequal';
import { CheckoutDetailsInput } from '@deity/falcon-shop-extension';
import { CheckoutAddress } from './CheckoutAddress';

export type CheckoutState = {
  isLoading: boolean;
  billingSameAsShipping: boolean; // TODO: do we really need this flag here?
  email?: string;
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  shippingMethod?: CheckoutDetailsInput;
  paymentMethod?: CheckoutDetailsInput;
};

type CheckoutSetState = {
  setLoading(isLoading: boolean): void;
  // setBillingSameAsShipping(same: boolean): void;
  setEmail(email: string): void;
  setShippingAddress(shippingAddress: CheckoutAddress): void;
  setBillingAddress(billingAddress: CheckoutAddress): void;
  setShippingMethod(shippingMethod: CheckoutDetailsInput): void;
  setPaymentMethod(paymentMethod: CheckoutDetailsInput): void;
};

type CheckoutStateType = {
  state: Readonly<CheckoutState>;
} & CheckoutSetState;

export const CheckoutStateContext = React.createContext<CheckoutStateType>({} as any);

type CheckoutStateProviderProps = {
  initialValues?: CheckoutState;
};
export const CheckoutStateProvider: React.FC<CheckoutStateProviderProps> = ({ initialValues, children }) => {
  const [state, setState] = useState<CheckoutState>({
    isLoading: false,
    billingSameAsShipping: false,
    ...initialValues
  });

  const setLoading = isLoading => {
    if (isLoading !== state.isLoading) setState({ ...state, isLoading });
  };

  const setEmail = email => {
    if (email !== state.email) setState({ ...state, email });
  };

  const setShippingAddress = shippingAddress => {
    if (!isEqual(shippingAddress, state.shippingAddress)) setState({ ...state, shippingAddress });
  };

  const setBillingAddress = billingAddress => {
    if (!isEqual(billingAddress, state.billingAddress)) setState({ ...state, billingAddress });
  };

  const setShippingMethod = shippingMethod => {
    if (!isEqual(shippingMethod, state.shippingAddress)) setState({ ...state, shippingMethod });
  };

  const setPaymentMethod = paymentMethod => {
    if (!isEqual(paymentMethod, state.paymentMethod)) setState({ ...state, paymentMethod });
  };

  return (
    <CheckoutStateContext.Provider
      value={{
        state,
        setLoading,
        setEmail,
        setShippingAddress,
        setBillingAddress,
        setShippingMethod,
        setPaymentMethod
      }}
    >
      {children}
    </CheckoutStateContext.Provider>
  );
};

export type CheckoutStatRenderProps = CheckoutStateType;
export const useCheckoutState: () => [CheckoutState, CheckoutSetState] = () => {
  const { state, ...rest } = useContext(CheckoutStateContext);

  return [state, rest];
};

export type CheckoutStateProps = {
  children(props: CheckoutStatRenderProps): any;
};
export const CheckoutState: React.SFC<CheckoutStateProps> = ({ children }) =>
  children(useContext(CheckoutStateContext));
