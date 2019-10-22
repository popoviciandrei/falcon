import React from 'react';

type NetworkStatusState = {
  isOnline: boolean;
};
export type NetworkStatusRenderProps = {
  isOnline: boolean;
};
export type NetworkStatusProps = {
  children: (renderProps: NetworkStatusRenderProps) => React.ReactNode;
};
export class NetworkStatus extends React.Component<NetworkStatusProps, NetworkStatusState> {
  constructor(props) {
    super(props);

    this.updateOnLineStatus = this.updateOnLineStatus.bind(this);

    this.state = {
      isOnline: true
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.updateOnLineStatus);
    window.addEventListener('offline', this.updateOnLineStatus);

    // run detection logic when component mounts as React 16 optimizes too much and doesn't
    // re-render even when SSR html doesn't match client-side
    // @see https://github.com/facebook/react/issues/10591
    this.updateOnLineStatus();
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnLineStatus);
    window.removeEventListener('offline', this.updateOnLineStatus);
  }

  updateOnLineStatus() {
    const { navigator } = window;
    const online = navigator && navigator.onLine;

    if (this.state.isOnline === online) {
      return;
    }

    this.setState({ isOnline: online });
  }

  render() {
    const { children } = this.props;
    const { isOnline } = this.state;

    return children({ isOnline });
  }
}
