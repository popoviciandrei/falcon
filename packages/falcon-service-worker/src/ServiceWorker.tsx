import React from 'react';
import { ServiceWorkerContext } from './ServiceWorkerContext';

export type ServiceWorkerRenderProps = {
  /** Determines if Service Worker API is supported by the Web Browser */
  isSupported: boolean;
  registration?: ServiceWorkerRegistration;
  /** If there's already an active Service Worker, then the user needs to close all their tabs before they'll get updates */
  isWaiting: boolean;
  /** Force update (auto reload in each open tab). */
  skipWaiting: Function;
};

export type ServiceWorkerProps = {
  children: (renderProps: ServiceWorkerRenderProps) => React.ReactNode;
};
export const ServiceWorker: React.SFC<ServiceWorkerProps> = ({ children }) => (
  <ServiceWorkerContext.Consumer>
    {({ isSupported, registration }) =>
      isSupported && registration ? (
        <ServiceWorkerInner registration={registration}>
          {({ isWaiting, skipWaiting }) =>
            children({
              isSupported,
              registration,
              isWaiting,
              skipWaiting
            })
          }
        </ServiceWorkerInner>
      ) : (
        children({
          isSupported,
          isWaiting: false,
          skipWaiting: () => {}
        })
      )
    }
  </ServiceWorkerContext.Consumer>
);

type ServiceWorkerInnerProps = {
  registration: ServiceWorkerRegistration;
  children: (renderProps: { isWaiting: boolean; skipWaiting: Function }) => React.ReactNode;
};
type ServiceWorkerInnerState = {} & Pick<ServiceWorkerRenderProps, 'isWaiting'>;
class ServiceWorkerInner extends React.Component<ServiceWorkerInnerProps, ServiceWorkerInnerState> {
  constructor(props) {
    super(props);

    this.skipWaiting = this.skipWaiting.bind(this);
    this.onUpdateFound = this.onUpdateFound.bind(this);

    this.state = {
      isWaiting: false
    };
  }

  componentDidMount() {
    const { registration } = this.props;

    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (registration.active && registration.waiting) {
      this.setState(state => ({ ...state, isWaiting: true }));

      return;
    }

    if (registration.installing) {
      return this.onUpdateFound();
    }

    registration.addEventListener('updatefound', this.onUpdateFound);
  }

  componentWillUnmount() {
    const { registration } = this.props;

    registration.removeEventListener('updatefound', this.onUpdateFound);
  }

  onUpdateFound() {
    const { registration } = this.props;

    if (registration.installing) {
      registration.installing.addEventListener('statechange', event => {
        if ((event.target as any).state === 'installed') {
          this.setState(state => ({ ...state, isWaiting: true }));
        }
      });
    }
  }

  skipWaiting() {
    const { registration } = this.props;

    return registration.waiting
      ? registration.waiting.postMessage({ type: 'SKIP_WAITING', payload: undefined })
      : () => {};
  }

  render() {
    const { children } = this.props;
    const { isWaiting } = this.state;

    return children({
      isWaiting,
      skipWaiting: this.skipWaiting
    });
  }
}
