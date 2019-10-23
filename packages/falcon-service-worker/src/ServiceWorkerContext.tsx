import React from 'react';

export type ServiceWorkerRegistrarContext = {
  scriptUrl: string;
  options?: RegistrationOptions;
  isSupported: boolean;
  registration?: ServiceWorkerRegistration;
};

export const ServiceWorkerContext = React.createContext<ServiceWorkerRegistrarContext>({
  scriptUrl: '/sw.js',
  isSupported: false
});
