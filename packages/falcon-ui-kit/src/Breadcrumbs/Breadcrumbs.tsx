import React from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumbs as FalconUiBreadcrumbs,
  BreadcrumbsProps as FalconUiBreadcrumbsProps,
  Breadcrumb
} from '@deity/falcon-ui';
import { BreadcrumbLink } from './BreadcrumbLink';

export type BreadcrumbItem = {
  name: string;
  urlPath?: string;
};
export type BreadcrumbsProps = FalconUiBreadcrumbsProps & {
  items: BreadcrumbItem[];
};

export const Breadcrumbs: React.SFC<BreadcrumbsProps> = ({ items, ...rest }) => (
  <FalconUiBreadcrumbs {...rest}>
    {items.map(item =>
      item.urlPath ? (
        <BreadcrumbLink key={item.name} to={item.urlPath}>
          {item.name}
        </BreadcrumbLink>
      ) : (
        <Breadcrumb key={item.name}>{item.name}</Breadcrumb>
      )
    )}
  </FalconUiBreadcrumbs>
);
Breadcrumbs.propTypes = {
  // @ts-ignore https://github.com/facebook/prop-types/issues/296
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      urlPath: PropTypes.string
    }).isRequired
  )
};
Breadcrumbs.defaultProps = {
  items: []
};
