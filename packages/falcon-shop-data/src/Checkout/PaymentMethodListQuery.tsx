import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
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
