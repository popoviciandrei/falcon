import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { useQuery, useLazyQuery, LazyQueryHookOptions, QueryHookOptions } from '@apollo/react-hooks';
import { PaymentMethod } from '@deity/falcon-shop-extension';

export const PAYMENT_METHOD_LIST = gql`
  query PaymentMethodList {
    paymentMethodList {
      code
      title
      config
    }
  }
`;

export type PaymentMethodListResponse = {
  paymentMethodList: PaymentMethod[];
};

export class PaymentMethodListQuery extends Query<PaymentMethodListResponse> {
  static defaultProps = {
    query: PAYMENT_METHOD_LIST
  };
}

export const usePaymentMethodListQuery = (options?: QueryHookOptions<PaymentMethodListResponse>) =>
  useQuery<PaymentMethodListResponse>(PAYMENT_METHOD_LIST, options);

export const usePaymentMethodListLazyQuery = (options?: LazyQueryHookOptions<PaymentMethodListResponse>) =>
  useLazyQuery<PaymentMethodListResponse>(PAYMENT_METHOD_LIST, options);
