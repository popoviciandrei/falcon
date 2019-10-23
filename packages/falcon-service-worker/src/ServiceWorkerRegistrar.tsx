import React from 'react';
import PropTypes from 'prop-types';
import { ServiceWorkerContext } from './ServiceWorkerContext';

export type ServiceWorkerRegistrarProps = {
  scriptUrl?: string;
  options?: RegistrationOptions;
};
export type ServiceWorkerRegistrarState = {
  isSupported: boolean;
  registration?: ServiceWorkerRegistration;
};
export class ServiceWorkerRegistrar extends React.Component<ServiceWorkerRegistrarProps, ServiceWorkerRegistrarState> {
  static defaultProps = {
    scriptUrl: '/sw.js'
  };

  static propTypes = {
    scriptUrl: PropTypes.string,
    options: PropTypes.shape({
      scope: PropTypes.string,
      type: PropTypes.oneOf(['classic', 'module']),
      updateViaCache: PropTypes.oneOf(['imports', 'all', 'none'])
    })
  };

  constructor(props) {
    super(props);

    this.onControllerChange = this.onControllerChange.bind(this);

    this.state = {
      isSupported: false,
      registration: undefined
    };
  }

  componentDidMount() {
    if (!this.isSupported) {
      return;
    }

    this.whenReady(() => {
      const { scriptUrl, options } = this.props;

      navigator.serviceWorker
        .register(scriptUrl, options)
        .then(registration => {
          this.setState(state => ({
            ...state,
            isSupported: true,
            registration
          }));
          navigator.serviceWorker.addEventListener('controllerchange', this.onControllerChange);

          console.log(`Service Worker '${scriptUrl}' registered in '${registration.scope}' scope.`);
        })
        .catch(error => {
          console.warn(`Service Worker '${scriptUrl}' registration failed.`, error);
        });
    });
  }

  componentWillUnmount() {
    if (!this.isSupported) {
      return;
    }

    navigator.serviceWorker.removeEventListener('controllerchange', this.onControllerChange);
  }

  onControllerChange(event) {
    if (event.currentTarget !== navigator.serviceWorker.controller) {
      return window.location.reload();
    }
  }

  get isSupported() {
    const { navigator, location } = window;
    const isApiAvailable = navigator && 'serviceWorker' in navigator;
    const isHttps = location.protocol === 'https:';
    const isLocalHost = location.host.match(/(localhost|127.0.0.1)/);

    return isApiAvailable && (isHttps || isLocalHost);
  }

  /**
   * if `document.readyState` is `complete` invoke `callback` immediately, otherwise delay it until `load` event is fired
   * @param {Function} callback function
   */
  whenReady(callback) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback);
    }
  }

  render() {
    const { children, scriptUrl, options } = this.props;
    const { isSupported, registration } = this.state;

    return (
      <ServiceWorkerContext.Provider value={{ isSupported, registration, scriptUrl, options }}>
        {children}
      </ServiceWorkerContext.Provider>
    );
  }
}
