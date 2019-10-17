import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs as FalconUiBreadcrumbs, Breadcrumb, ThemedComponentProps } from '@deity/falcon-ui';
import { BreadcrumbLink } from './BreadcrumbLink';

export type BreadcrumbItem = {
  name: string;
  urlPath?: string;
};
export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
} & ThemedComponentProps<any>;

export const Breadcrumbs: React.SFC<BreadcrumbsProps> = ({ items, ...rest }) => (
  <FalconUiBreadcrumbs {...(rest as any)}>
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
  items: PropTypes.arrayOf(PropTypes.object.isRequired)
};
Breadcrumbs.defaultProps = {
  items: []
};
