import { DocumentNode } from 'graphql';
import { OperationVariables } from '@apollo/react-common';
import { useQuery as useApolloQuery, QueryHookOptions } from '@apollo/react-hooks';
import { FetchMore } from './fetchMore';

export type UseQueryOptions<TData, TVariables> = QueryHookOptions<TData, TVariables> & {
  fetchMore?: FetchMore<TData, TVariables>;
};
export function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: UseQueryOptions<TData, TVariables>
) {
  const { fetchMore, ...restOptions } = options || ({} as UseQueryOptions<TData, TVariables>);
  const result = useApolloQuery<TData, TVariables>(query, restOptions);
  const { data, fetchMore: apolloFetchMore } = result;

  return {
    ...result,
    fetchMore: fetchMore ? () => fetchMore(data!, result.fetchMore) : apolloFetchMore
  };
}
