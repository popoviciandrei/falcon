import React from 'react';
import { List, ListItem } from '@deity/falcon-ui';
import { Error } from '../Error';

export type FormErrorSummaryProps = {
  errors?: string | string[];
};
export const FormErrorSummary: React.SFC<FormErrorSummaryProps> = ({ errors }) => {
  if (!errors) {
    return null;
  }
  errors = Array.isArray(errors) ? errors : [errors];

  return errors.length ? (
    <List>
      {errors.map(error => (
        <Error as={ListItem} key={error}>
          {error}
        </Error>
      ))}
    </List>
  ) : null;
};
