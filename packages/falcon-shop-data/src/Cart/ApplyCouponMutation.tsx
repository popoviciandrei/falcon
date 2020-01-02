import gql from 'graphql-tag';
import { Mutation, OperationInput } from '@deity/falcon-data';
import { CouponInput } from '@deity/falcon-shop-extension';

export const APPLY_COUPON = gql`
  mutation ApplyCoupon($input: CouponInput!) {
    applyCoupon(input: $input)
  }
`;

export type ApplyCouponResult = {
  applyCoupon: boolean;
};

export class ApplyCouponMutation extends Mutation<ApplyCouponResult, OperationInput<CouponInput>> {
  static defaultProps = {
    mutation: APPLY_COUPON,
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true
  };
}
