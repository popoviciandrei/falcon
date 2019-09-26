import React from 'react';
import { MutationFunction, MutationResult } from '@apollo/react-common';
import { SignOutMutation, SignOutResponse, IsAuthenticatedQuery } from '@deity/falcon-shop-data';

export type SignOutProviderRenderProps = {
  isSignedIn: boolean;
  signOut: MutationFunction<SignOutResponse, {}>;
  result: MutationResult<SignOutResponse>;
};

export type SignOutProviderProps = {
  children: (renderProps: SignOutProviderRenderProps) => any;
};
export const SignOutProvider: React.SFC<SignOutProviderProps> = ({ children }) => (
  <IsAuthenticatedQuery>
    {({ data: { customer } }) => (
      <SignOutMutation>{(signOut, result) => children({ isSignedIn: !!customer, signOut, result })}</SignOutMutation>
    )}
  </IsAuthenticatedQuery>
);
