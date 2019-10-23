import gql from 'graphql-tag';
import { Mutation } from '@deity/falcon-data';

export const CANCEL_COUPON = gql`
  mutation CancelCoupon {
    cancelCoupon
  }
`;

export type CancelCouponResponse = {
  cancelCoupon: boolean;
};

export class CancelCouponMutation extends Mutation<CancelCouponResponse, {}> {
  static defaultProps = {
    mutation: CANCEL_COUPON,
    refetchQueries: ['Cart']
  };
}
