import gql from 'graphql-tag';
import { Order } from '@deity/falcon-shop-extension';
import { Query, FetchMore, Pagination, PaginationQuery } from '@deity/falcon-data';

export const GET_ORDER_LIST = gql`
  query OrderList($pagination: PaginationInput) {
    orderList(pagination: $pagination) {
      items {
        id
        referenceNo
        createdAt
        customerFirstname
        customerLastname
        status
        grandTotal
        orderCurrencyCode
      }
      pagination {
        currentPage
        totalItems
        nextPage
      }
    }
  }
`;

export type OrderListResponse = {
  orderList: {
    items: Pick<
      Order,
      | 'id'
      | 'referenceNo'
      | 'createdAt'
      | 'customerFirstname'
      | 'customerLastname'
      | 'status'
      | 'grandTotal'
      | 'orderCurrencyCode'
    >[];
    pagination: Pick<Pagination, 'currentPage' | 'totalItems' | 'nextPage'>;
  };
};

const fetchMore: FetchMore<OrderListResponse, PaginationQuery> = (data: OrderListResponse, apolloFetchMore: any) =>
  apolloFetchMore({
    variables: { pagination: { ...data.orderList.pagination, page: data.orderList.pagination.nextPage } },
    updateQuery: (prev: OrderListResponse, { fetchMoreResult }: { fetchMoreResult: OrderListResponse }) => {
      if (!fetchMoreResult) {
        return prev;
      }

      return {
        ...prev,
        ...{
          orderList: {
            ...prev.orderList,
            items: [...prev.orderList.items, ...fetchMoreResult.orderList.items],
            pagination: { ...fetchMoreResult.orderList.pagination }
          }
        }
      };
    }
  });

export class OrderListQuery extends Query<OrderListResponse, PaginationQuery> {
  static defaultProps = {
    query: GET_ORDER_LIST,
    fetchMore,
    notifyOnNetworkStatusChange: true
  };
}
