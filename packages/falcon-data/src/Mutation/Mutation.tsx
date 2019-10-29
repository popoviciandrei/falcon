import React from 'react';
import { OperationVariables, MutationResult, MutationFunction } from '@apollo/react-common';
import { Mutation as ApolloMutation, MutationComponentOptions } from '@apollo/react-components';

export type MutationProps<TData, TVariables> = MutationComponentOptions<TData, TVariables>;

export class Mutation<
  TData extends object = any,
  TVariables extends OperationVariables = OperationVariables
> extends React.Component<MutationProps<TData, TVariables>> {
  static propTypes = {
    ...ApolloMutation.propTypes
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <ApolloMutation {...restProps}>
        {(mutation: MutationFunction<TData, TVariables>, result: MutationResult<TData>) => children(mutation, result)}
      </ApolloMutation>
    );
  }
}
