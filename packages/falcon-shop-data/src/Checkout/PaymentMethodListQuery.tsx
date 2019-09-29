import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { PaymentMethod, PaymentMethodListInput } from '@deity/falcon-shop-extension';

export const PAYMENT_METHOD_LIST = gql`
  query PaymentMethodList($input: PaymentMethodListInput) {
    paymentMethodList(input: $input) {
      code
      title
      config
    }
  }
`;

export type PaymentMethodListResponse = {
  paymentMethodList: PaymentMethod[];
};

export class PaymentMethodListQuery extends Query<PaymentMethodListResponse, PaymentMethodListInput> {
  static defaultProps = {
    query: PAYMENT_METHOD_LIST
  };
}
