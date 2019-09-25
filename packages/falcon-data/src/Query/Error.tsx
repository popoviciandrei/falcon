import React from 'react';
import { ApolloError } from 'apollo-client';
import { getErrorCode } from './getErrorCode';

export type ErrorProps = {
  error: ApolloError;
};
export const Error = ({ error }) => {
  const code = getErrorCode(error);

  return (
    <div className="error">
      {code && <p>{`Error: ${code}`}</p>}
      <p>{error}</p>
    </div>
  );
};
