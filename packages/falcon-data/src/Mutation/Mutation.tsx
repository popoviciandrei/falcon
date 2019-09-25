import React from 'react';
import PropTypes from 'prop-types';
import { OperationVariables, MutationResult, MutationFunction } from '@apollo/react-common';
import { Mutation as ApolloMutation, MutationComponentOptions } from '@apollo/react-components';
import { Loader, Error } from '../Query';

export type MutationProps<TData, TVariables> = MutationComponentOptions<TData, TVariables> & {
  passLoading?: boolean;
  passError?: boolean;
};

export class Mutation<TData = any, TVariables = OperationVariables> extends React.Component<
  MutationProps<TData, TVariables>
> {
  static propTypes = {
    ...ApolloMutation.propTypes,
    passLoading: PropTypes.bool,
    passError: PropTypes.bool
  };

  render() {
    const { children, passError, passLoading, ...restProps } = this.props;
    return (
      <ApolloMutation {...restProps}>
        {(mutation: MutationFunction<TData, TVariables>, result: MutationResult<TData>) => {
          const { loading, error } = result;

          if (!passError && error) {
            return <Error error={error} />;
          }

          if (!passLoading && loading) {
            return <Loader />;
          }
          return children(mutation, result);
        }}
      </ApolloMutation>
    );
  }
}
