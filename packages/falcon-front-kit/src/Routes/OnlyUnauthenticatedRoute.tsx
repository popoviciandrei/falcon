import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IsAuthenticatedQuery } from '@deity/falcon-shop-data';

export type OnlyUnauthenticatedRouteProps = {
  /** default redirection url is `/` */
  redirectTo: string;
} & RouteProps;

export class OnlyUnauthenticatedRoute extends React.Component<OnlyUnauthenticatedRouteProps> {
  static propTypes = {
    ...(Route as any).propTypes,
    redirectTo: PropTypes.string
  };

  static defaultProps = {
    redirectTo: '/'
  };

  render() {
    const { component, redirectTo, ...rest } = this.props;
    const Component = component as React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;

    return (
      <Route
        {...rest}
        render={props => (
          <IsAuthenticatedQuery>
            {({ data }) =>
              data.customer ? (
                <Redirect
                  to={{
                    pathname: redirectTo
                  }}
                />
              ) : (
                <Component {...props} />
              )
            }
          </IsAuthenticatedQuery>
        )}
      />
    );
  }
}
