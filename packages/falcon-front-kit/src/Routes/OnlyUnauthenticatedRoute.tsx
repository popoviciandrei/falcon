import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { Loader } from '@deity/falcon-data';
import { IsAuthenticatedQuery } from '@deity/falcon-shop-data';

export type OnlyUnauthenticatedRouteProps = {
  /** default redirection url is `/` */
  redirectTo: string;
} & RouteProps;

export class OnlyUnauthenticatedRoute extends React.Component<OnlyUnauthenticatedRouteProps> {
  static defaultProps = {
    redirectTo: '/'
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
          <IsAuthenticatedQuery fetchPolicy="network-only" passLoading>
            {({ data, loading }) => {
              if (loading) {
                // we can not render anything until we do not known if customer is authenticated or not
                return <Loader />;
              }

              if (data.customer) {
                return <Redirect to={{ pathname: redirectTo }} />;
              }

              return <Component {...props} />;
            }}
          </IsAuthenticatedQuery>
        )}
      />
    );
  }
}
