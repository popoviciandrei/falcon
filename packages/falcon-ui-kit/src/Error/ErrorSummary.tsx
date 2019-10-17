import React from 'react';
import PropTypes from 'prop-types';
import { ErrorModel } from '@deity/falcon-data';
import { ListItem, ThemedComponentPropsWithCss } from '@deity/falcon-ui';
import { ErrorListLayout } from './ErrorListLayout';
import { Error } from './Error';

export type ErrorSummaryProps = {
  errors: ErrorModel | ErrorModel[];
};
export const ErrorSummary: React.SFC<ErrorSummaryProps & ThemedComponentPropsWithCss> = ({ errors, ...rest }) => {
  errors = Array.isArray(errors) ? errors : [errors];

  return (
    <ErrorListLayout {...(rest as any)}>
      {errors.map(error => (
        <Error as={ListItem} key={error.message} insights={error}>
          {error.message}
        </Error>
      ))}
    </ErrorListLayout>
  );
};
ErrorSummary.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired
      })
    )
  ])
};
