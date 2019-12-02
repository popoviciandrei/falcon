import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, matchPath, match as Match, SwitchProps } from 'react-router-dom';
import { Location } from 'history';
import { UrlQuery, ResourceMeta, Loader, OperationError } from '@deity/falcon-data';
import { Router } from '../Router';

export type DynamicRouteComponentProps = Pick<ResourceMeta, 'id' | 'path'>;
export type ComponentsMap = Record<string, React.ComponentType<DynamicRouteComponentProps> | object>;
export type DynamicRouteProps = {
  location?: Location;
  components: ComponentsMap;
  notFound: React.ComponentType<{ location?: any }>;
};
export const DynamicRoute: React.SFC<DynamicRouteProps> = props => {
  const { components, notFound: NotFound } = props;

  return (
    <Router>
      {router => {
        const location = props.location || router.location;
        const { pathname: path } = location;

        return (
          <UrlQuery variables={{ path }}>
            {({ data: { url } }) => {
              if (!url) {
                return <NotFound location={location} />;
              }

              if (url.redirect) {
                return <Redirect to={url.path} />;
              }

              const Component = components[url.type] as React.ComponentType<DynamicRouteComponentProps>;
              if (!Component) {
                throw new Error(`[DynamicRoute]: Please register component for '${url.type}' content type!`);
              }

              return <Component id={url.id} path={url.path} />;
            }}
          </UrlQuery>
        );
      }}
    </Router>
  );
};
DynamicRoute.propTypes = {
  location: PropTypes.any,
  components: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired).isRequired,
  notFound: PropTypes.func.isRequired
};
