import React from 'react';

export type FormContextValue = {
  id: string;
  name?: string;
  i18nId?: string;
};

export const FormContext = React.createContext<FormContextValue>({} as any);
