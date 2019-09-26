import React from 'react';
import { List, ListItem } from '@deity/falcon-ui';

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
        <ListItem my="md" color="error" key={error}>
          {error}
        </ListItem>
      ))}
    </List>
  ) : null;
};
