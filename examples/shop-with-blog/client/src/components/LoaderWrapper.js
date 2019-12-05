import React from 'react';
import { Loader } from '@deity/falcon-ui-kit';

export const LoaderWrapper = ({ children }) => (
  <React.Fragment>
    <Loader variant="overlay" />
    {children}
  </React.Fragment>
);
