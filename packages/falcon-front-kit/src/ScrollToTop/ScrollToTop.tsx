import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

class ScrollToTopInner extends React.Component<RouteComponentProps> {
  componentDidUpdate(prevProps: RouteComponentProps) {
    const { location } = this.props;

    if (location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { children } = this.props;

    return children || null;
  }
}

export const ScrollToTop = withRouter(ScrollToTopInner);
