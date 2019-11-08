import React, { useContext } from 'react';
import { CheckoutContext, CheckoutProviderRenderProps } from './CheckoutContext';

export const useCheckout = () => useContext(CheckoutContext);

export const Checkout: React.SFC<{ children: (props: CheckoutProviderRenderProps) => any }> = ({ children }) =>
  children({ ...useCheckout() });
