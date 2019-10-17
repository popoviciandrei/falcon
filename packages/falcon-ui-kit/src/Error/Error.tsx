import React from 'react';
import { Text, ThemedComponentPropsWithVariants } from '@deity/falcon-ui';

const errorInsights = ({ message, ...rest }) => {
  if (process.env.NODE_ENV !== 'production') {
    return JSON.stringify({ ...rest }, null, 2);
  }

  return '';
};

export type ErrorProps = {
  insights?: any;
};
export const Error: React.SFC<ErrorProps & ThemedComponentPropsWithVariants> = ({ children, insights, ...rest }) => {
  return (
    <Text defaultTheme={{ error: { color: 'error' } }} title={errorInsights(insights)} {...(rest as any)}>
      {children}
    </Text>
  );
};
