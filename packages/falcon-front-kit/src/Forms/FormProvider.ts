import { FormikProps, FormikValues } from 'formik';

export type FormProviderProps<TValues = FormikValues, TResult = any> = {
  /** Invoked when form is successfully submit */
  onSuccess?: Function | ((data: TResult) => any);
  initialValues?: TValues;
  children?: ((props: FormProviderRenderProps<TValues, TResult>) => React.ReactNode) | React.ReactNode;
};

export type FormProviderRenderProps<TValues, TResult> = {
  status: {
    [key: string]: any;
    data?: TResult;
    error?: any;
  };
} & Omit<FormikProps<TValues>, 'status'>;
