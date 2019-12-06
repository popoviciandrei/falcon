import gql from 'graphql-tag';
import { Query, Pagination, PaginationInput, Aggregation, SortOrderValue } from '@deity/falcon-data';
import { Category, Product, FilterInput } from '@deity/falcon-shop-extension';

export const GET_CATEGORY_WITH_PRODUCT_LIST = gql`
  query CategoryWithProductList(
    $categoryId: ID!
    $sort: SortOrderInput
    $pagination: PaginationInput
    $filters: [FilterInput!]
  ) {
    category(id: $categoryId) {
      id
      name
      seo {
        title
        description
        keywords
      }
      productList(input: { sort: $sort, pagination: $pagination, filters: $filters }) {
        items {
          id
          name
          price {
            regular
            special
            minTier
          }
          thumbnail
          urlPath
        }
        pagination {
          currentPage
          totalItems
          nextPage
        }
        aggregations {
          field
          type
          buckets {
            value
            count
            title
          }
          title
        }
      }
    }
  }
`;

export type CategoryWithProductListResponse = Pick<Category, 'id' | 'name' | 'seo'> & {
  productList: {
    items: Pick<Product, 'id' | 'name' | 'price' | 'thumbnail' | 'urlPath'>[];
    pagination: Pick<Pagination, 'currentPage' | 'totalItems' | 'nextPage'>;
    aggregations: Pick<Aggregation, 'field' | 'type' | 'title' | 'buckets'>;
  };
};

export type CategoryWithProductListVariables = {
  categoryId?: string;
  sort?: SortOrderValue;
  pagination?: PaginationInput;
  filters?: FilterInput[];
};

const fetchMore = (data: any, apolloFetchMore: any) =>
  apolloFetchMore({
    variables: {
      pagination: {
        page: data.category.productList.pagination.nextPage
      }
    },
    updateQuery: (prev: any, { fetchMoreResult }: any) => {
      if (!fetchMoreResult) {
        return prev;
      }

      return {
        ...prev,
        category: {
          ...prev.category,
          productList: {
            ...prev.category.productList,
            items: [...prev.category.productList.items, ...fetchMoreResult.category.productList.items],
            pagination: { ...fetchMoreResult.category.productList.pagination }
          }
        }
      };
    }
  });

export class CategoryWithProductListQuery extends Query<
  CategoryWithProductListResponse,
  CategoryWithProductListVariables
> {
  static defaultProps = {
    query: GET_CATEGORY_WITH_PRODUCT_LIST,
    fetchPolicy: 'cache-and-network',
    fetchMore,
    notifyOnNetworkStatusChange: true
  };
}
