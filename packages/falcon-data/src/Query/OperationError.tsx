import React from 'react';
import { ApolloError } from 'apollo-client';
import { ErrorModel, useGetUserError } from '../Error';

export type OperationErrorProps = ApolloError;
export const OperationError: React.SFC<OperationErrorProps> = props => {
  const [, { error: errors }] = useGetUserError(props);

  const errorInsights = ({ message, ...rest }: ErrorModel) => {
    if (process.env.NODE_ENV !== 'production') {
      return JSON.stringify({ ...rest }, null, 2);
    }
    return '';
  };

  return errors.length <= 1 ? (
    <p title={errorInsights(errors[0])} className="error">
      {errors[0].message}
    </p>
  ) : (
    <ul className="error">
      {errors.map(error => {
        return (
          <li key={error.message} title={errorInsights(error)}>
            {error.message}
          </li>
        );
      })}
    </ul>
  );
};
