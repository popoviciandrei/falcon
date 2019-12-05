import React, { useState } from 'react';
import { matchPath, match as Match, SwitchProps } from 'react-router-dom';
import { Location } from 'history';
import { UrlQuery, ResourceMeta, Loader, OperationError } from '@deity/falcon-data';
import { Router } from '../Router';

export type SwitchDynamicURL = SwitchProps & {
  /**
   * invoked when fetching `Url` data
   * @example 
   * <SwitchDynamicURL
      onLoading={({ component }) => (
        <React.Fragment>
          <Loader variant="overlay" />
          {component}
        </React.Fragment>
      )}
    >
   */
  onLoading?: (props: { component: React.ReactNode; location?: Location; match: Match<any> }) => React.ReactNode;
};
/**
 * `react-router` `Switch` component which is able to handle dynamically resolved components.
 * It works with `Url` query.
 * @example
 * <SwitchDynamicURL>
    <Route exact path="/" component={Home} />
    <Route exact type="shop-product" component={Product} />
    <p>not Found</p>
  </SwitchDynamicURL>
 * @param {SwitchDynamicURL} props
 */
export const SwitchDynamicURL: React.FC<SwitchDynamicURL> = props => {
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

                    const componentProps = {
                      location: previousLocation,
                      computedMatch: previousMatch
                    };
                    const component = React.cloneElement(previousElement as any, componentProps);

                    return props.onLoading
                      ? props.onLoading({
                          component,
                          location: componentProps.location,
                          match: componentProps.computedMatch
                        })
                      : component;
                  }

                  return <Loader variant="overlay" />;
                }

                if (error) {
                  return <OperationError {...error} />;
                }

                setPreviousLocation(location);
                const [match, element] = findRouteElement(props.children, location, data && data.url);
                if (match) {
                  if (data && data.url) {
                    match.params = {
                      ...match.params,
                      id: data.url.id,
                      path: data.url.path
                    };
                  }

                  return React.cloneElement(element as any, { location, computedMatch: match });
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
