import React, { useContext } from 'react';
import { CheckoutContext, CheckoutProviderRenderProps } from './CheckoutContext';

export const useCheckout = () => useContext(CheckoutContext);

export type CheckoutProps = { children: (props: CheckoutProviderRenderProps) => any };
export const Checkout: React.SFC<CheckoutProps> = ({ children }) => children(useCheckout());
