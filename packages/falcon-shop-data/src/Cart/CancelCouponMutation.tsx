import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { CouponInput } from '@deity/falcon-shop-extension';

export const CANCEL_COUPON = gql`
  mutation CancelCoupon($input: CouponInput!) {
    cancelCoupon(input: $input)
  }
`;

export type CancelCouponResponse = {
  cancelCoupon: boolean;
};

export class CancelCouponMutation extends Mutation<CancelCouponResponse, OperationInput<CouponInput>> {
  static defaultProps = {
    mutation: CANCEL_COUPON,
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true
  };
}
