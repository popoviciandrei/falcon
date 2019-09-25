import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';

export const VALIDATE_PASSWORD_TOKEN_QUERY = gql`
  query ValidatePasswordToken($token: String!) {
    validatePasswordToken(token: $token)
  }
`;

export type ValidatePasswordTokenResponse = {
  validatePasswordToken: boolean;
};

export type ValidatePasswordTokenVariables = {
  token: string;
};

export class ValidatePasswordTokenQuery extends Query<ValidatePasswordTokenResponse, ValidatePasswordTokenVariables> {
  static defaultProps = {
    query: VALIDATE_PASSWORD_TOKEN_QUERY
  };
}
