import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { Breadcrumb, Link, ThemedComponentProps } from '@deity/falcon-ui';

export type BreadcrumbLinkProps = Pick<LinkProps, 'to'> & ThemedComponentProps;
export const BreadcrumbLink: React.SFC<BreadcrumbLinkProps> = ({ to, children, ...rest }) => (
  <Breadcrumb {...(rest as any)}>
    <Link as={RouterLink} to={to}>
      {children}
    </Link>
  </Breadcrumb>
);
BreadcrumbLink.propTypes = {
  to: PropTypes.string.isRequired
};
