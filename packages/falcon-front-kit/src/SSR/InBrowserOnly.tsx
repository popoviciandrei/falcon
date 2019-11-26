import React, { useEffect, useState, Children } from 'react';
import PropTypes from 'prop-types';

export type InBrowserOnlyProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};
export const InBrowserOnly: React.SFC<InBrowserOnlyProps> = ({ children, fallback }) => {
  const [showChildren, setShowChildren] = useState(false);
  useEffect(() => {
    setShowChildren(true);
  }, []);

  return <React.Fragment>{showChildren ? children : fallback || null}</React.Fragment>;
};
InBrowserOnly.propTypes = {
  children: PropTypes.node.isRequired
};
