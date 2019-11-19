import React, { useContext } from 'react';
import { CheckoutContext, CheckoutContextType } from './CheckoutContext';

export type CheckoutRenderProps = CheckoutContextType;
export const useCheckout = () => useContext(CheckoutContext) as CheckoutRenderProps;

export type CheckoutProps = { children: (props: CheckoutRenderProps) => any };
export const Checkout: React.FC<CheckoutProps> = ({ children }) => children(useCheckout());
