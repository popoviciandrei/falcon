import { FormikProps, FormikValues } from 'formik';
import { ErrorModel } from '@deity/falcon-data';

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
    error?: ErrorModel | ErrorModel[];
  };
} & Omit<FormikProps<TValues>, 'status'>;
