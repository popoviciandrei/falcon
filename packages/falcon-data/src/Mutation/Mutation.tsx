import React from 'react';
import { OperationVariables, MutationResult, MutationFunction } from '@apollo/react-common';
import { Mutation as ApolloMutation, MutationComponentOptions } from '@apollo/react-components';

export type MutationProps<TData, TVariables> = MutationComponentOptions<TData, TVariables>;

export class Mutation<TData = any, TVariables = OperationVariables> extends React.Component<
  MutationProps<TData, TVariables>
> {
  static propTypes = {
    ...ApolloMutation.propTypes
  };

  render() {
    // seems like `optimisticResponse` keeps using its prop-types defined in the following file:
    // node_modules/@apollo/react-components/lib/Mutation.d.ts:9
    // Compiler throws an error with the following message:
    // --------------------------------------------------------------------------------
    // Type 'TData | ((vars: TVariables) => TData)' is not assignable to type 'object'.
    // Type 'TData' is not assignable to type 'object'
    // --------------------------------------------------------------------------------
    const { children, optimisticResponse, ...restProps } = this.props;
    return (
      <ApolloMutation optimisticResponse={optimisticResponse as any} {...restProps}>
        {(mutation: MutationFunction<TData, TVariables>, result: MutationResult<TData>) => children(mutation, result)}
      </ApolloMutation>
    );
  }
}
