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

export const SwitchDynamicURL: React.FC<SwitchProps> = props => {
  const [previousLocation, setPreviousLocation] = useState<Location<any>>(undefined);
  const [previousResourceMeta, setPreviousResourceMeta] = useState<ResourceMeta>(undefined);

  const isResourceMetaRequired = (children: React.ReactNode, location: Location): boolean => {
    let result = false;
    let match: Match<any> | null;

    // We use React.Children.forEach instead of React.Children.toArray().find()
    // here because toArray adds keys to all child elements and we do not want
    // to trigger an unmount/remount for two <Route>s that render the same
    // component at different URLs.
    React.Children.forEach(children, child => {
      if (!result && match == null && React.isValidElement(child)) {
        const path = child.props.path || child.props.from;
        if (path) {
          match = matchPath(location.pathname, { ...child.props, path });
        } else {
          result = !!child.props.type;
        }
      }
    });

    return result;
  };

  const findRouteElement = (
    children: React.ReactNode,
    location: Location,
    resourceMeta?: ResourceMeta
  ): [Match | null, React.ReactNode] => {
    let element: React.ReactNode;
    let match: Match<any> | null;

    // We use React.Children.forEach instead of React.Children.toArray().find()
    // here because toArray adds keys to all child elements and we do not want
    // to trigger an unmount/remount for two <Route>s that render the same
    // component at different URLs.
    React.Children.forEach(children, child => {
      if (match == null && React.isValidElement(child)) {
        const path = child.props.path || child.props.from;
        if (path) {
          match = matchPath(location.pathname, { ...child.props, path });
        } else {
          // eslint-disable-next-line
          if (child.props.type && resourceMeta) {
            match = matchPath(resourceMeta.type, { ...child.props, path: child.props.type });
          }
        }

        // eslint-disable-next-line
        element = child;
      }
    });

    return [match, element];
  };

  return (
    <Router>
      {context => {
        const location = props.location || context.location;
        if (isResourceMetaRequired(props.children, location) === false) {
          setPreviousLocation(location);
          const [match, element] = findRouteElement(props.children, location);
          const computedMatch = match || context.match;
          if (computedMatch) {
            return React.cloneElement(element as any, { location, computedMatch });
          }
        } else {
          return (
            <UrlQuery
              variables={{ path: location.pathname }}
              passLoading
              onCompleted={result => {
                if (result) setPreviousResourceMeta(result.url);
              }}
            >
              {({ data, error, loading }) => {
                if (loading) {
                  const [previousMatch, previousElement] = previousLocation
                    ? findRouteElement(props.children, previousLocation, previousResourceMeta)
                    : [undefined, undefined];

                  if (previousMatch) {
                    if (previousResourceMeta) {
                      previousMatch.params = {
                        ...previousMatch.params,
                        id: previousResourceMeta.id,
                        path: previousResourceMeta.path
                      };
                    }

                    return React.cloneElement(previousElement as any, {
                      location: previousLocation,
                      computedMatch: previousMatch
                    });

                    // TODO: decide if want to add loader overlay, or expose this.
                    // return (
                    //   <React.Fragment>
                    //     <Loader variant="overlay" />
                    //     {React.cloneElement(previousElement as any, {
                    //       location: previousLocation,
                    //       computedMatch: previousMatch
                    //     })}
                    //   </React.Fragment>
                    // );
                  }

                  return <Loader variant="overlay" />;
                }

                if (error) {
                  return <OperationError {...error} />;
                }

                setPreviousLocation(location);
                const [match, element] = findRouteElement(props.children, location, data && data.url);
                const computedMatch = match || context.match;
                if (computedMatch) {
                  if (data && data.url) {
                    computedMatch.params = {
                      ...computedMatch.params,
                      id: data.url.id,
                      path: data.url.path
                    };
                  }

                  return React.cloneElement(element as any, { location, computedMatch });
                }

                return null;
              }}
            </UrlQuery>
          );
        }

        return null;
      }}
    </Router>
  );
};
