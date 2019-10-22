import React from 'react';
import ReactRouterDom, { withRouter, RouteComponentProps } from 'react-router-dom';
// eslint-disable-next-line
import { History, Location } from 'history';

export type RouterRenderProps = {
  children: (props: ReactRouterRenderProps) => any;
} & RouteComponentProps;

export type ReactRouterRenderProps = {
  match: ReactRouterDom.match;
  location: Location;
  history: History;
};

const RenderRouterProps: React.SFC<RouterRenderProps> = props => {
  const { match, location, history, children } = props;

  return children({ match, location, history });
};

export const Router = withRouter(RenderRouterProps);
