import { QueryResult } from '@apollo/react-common';

export type ApolloFetchMore<TData, TVariables> = QueryResult<TData, TVariables>['fetchMore'];
export type FetchMore<TData, TVariables> = (data: TData, fetchMore: ApolloFetchMore<TData, TVariables>) => any;
