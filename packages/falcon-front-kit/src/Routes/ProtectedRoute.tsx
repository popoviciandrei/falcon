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
                // we can not render anything until we get know if the customer is authenticated or not
                return <Loader />;
              }

              if (data.customer) {
                return <Component {...props} />;
              }

              const { location } = props;
              const { pathname, search } = location;

              const hasRedirectToQueryPart = redirectTo.indexOf('?') > -1;
              const query = new URLSearchParams(
                hasRedirectToQueryPart ? redirectTo.substring(redirectTo.indexOf('?') + 1) : ''
              );
              query.append('next', `${pathname}${search}`);

              return (
                <Redirect
                  to={{
                    pathname: hasRedirectToQueryPart ? redirectTo.substring(0, redirectTo.indexOf('?')) : redirectTo,
                    search: `?${query}`,
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
