import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IsAuthenticatedQuery } from '@deity/falcon-shop-data';

export type ProtectedRouteProps = {
  /** default redirection url is `/sign-in` */
  redirectTo: string;
} & RouteProps;

export class ProtectedRoute extends React.Component<ProtectedRouteProps> {
  static defaultProps = {
    redirectTo: '/sign-in'
  };

  static propTypes = {
    ...(Route as any).propTypes,
    redirectTo: PropTypes.string
  };

  render() {
    const { component, redirectTo, ...rest } = this.props;
    const Component = component as React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;

    return (
      <Route
        {...rest}
        render={props => (
          <IsAuthenticatedQuery fetchPolicy="network-only">
            {({ data }) => {
              if (data.customer) {
                return <Component {...props} />;
              }

              const { location } = props;
              const { pathname, search } = location;

              return (
                <Redirect
                  to={{
                    pathname: redirectTo,
                    search: `?${new URLSearchParams({ next: `${pathname}${search}` })}`,
                    state: { nextLocation: location }
                  }}
                />
              );
            }}
          </IsAuthenticatedQuery>
        )}
      />
    );
  }
}
