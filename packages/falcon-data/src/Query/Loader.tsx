import React from 'react';

export type LoaderProps = {
  variant?: any;
};
export const Loader: React.FC<LoaderProps> = props => (
  <div className="loader" {...props}>
    Loading...
  </div>
);
