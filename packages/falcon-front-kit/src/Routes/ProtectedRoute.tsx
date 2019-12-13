import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { Loader } from '@deity/falcon-data';
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
          <IsAuthenticatedQuery passLoading>
            {({ data, loading }) => {
              if (loading) {
                // we can not render anything until we do not known if customer is authenticated or not
                return <Loader />;
              }

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
