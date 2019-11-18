import React, { useContext } from 'react';
import { CheckoutContext, CheckoutContextType } from './CheckoutContext';

export const useCheckout = () => useContext(CheckoutContext);

export type CheckoutProps = { children: (props: CheckoutContextType) => any };
export const Checkout: React.FC<CheckoutProps> = ({ children }) => children(useCheckout());
