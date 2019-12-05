import React from 'react';
import PropTypes from 'prop-types';
import { OperationVariables, QueryResult } from '@apollo/react-common';
import { Query as ApolloQuery, QueryComponentOptions } from '@apollo/react-components';
import { NetworkStatus } from 'apollo-client';
import { Loader } from './Loader';
import { OperationError } from './OperationError';
import { FetchMore, ApolloFetchMore } from './fetchMore';

export type QueryRenderProps<TData = any, TVariables = OperationVariables> = {
  fetchMore: (() => any) | ApolloFetchMore<TData, TVariables>;
} & Omit<QueryResult<TData, TVariables>, 'fetchMore'>;

export type QueryProps<TData, TVariables> = {
  fetchMore?: FetchMore<TData, TVariables>;
  passLoading?: boolean;
  passError?: boolean;
  children?: (renderProps: QueryRenderProps<TData, TVariables>) => any;
} & Omit<QueryComponentOptions<TData, TVariables>, 'children'>;

export class Query<TData = any, TVariables = OperationVariables> extends React.Component<
  QueryProps<TData, TVariables>
> {
  static propTypes = {
    ...ApolloQuery.propTypes,
    passLoading: PropTypes.bool,
    passError: PropTypes.bool
  };

  render() {
    const { children, fetchMore, passLoading, passError, ...restProps } = this.props;

    return (
      <ApolloQuery {...restProps}>
        {(result: QueryResult<TData, TVariables>) => {
          const { networkStatus, error, data, fetchMore: apolloFetchMore } = result;

          if (!passError && error) {
            return <OperationError {...error} />;
          }

          const loading =
            networkStatus === NetworkStatus.loading || (networkStatus !== NetworkStatus.fetchMore && result.loading);
          if (!passLoading && loading) {
            if (data) {
              return children({
                ...result,
                data,
                fetchMore: fetchMore ? () => fetchMore(data!, result.fetchMore) : apolloFetchMore
              });
            }

            return <Loader />;
          }

          return children({
            ...result,
            data: data || ({} as TData),
            fetchMore: fetchMore ? () => fetchMore(data!, result.fetchMore) : apolloFetchMore
          });
        }}
      </ApolloQuery>
    );
  }
}
