import { FormikConfig, FormikValues } from 'formik';

export type FormProviderProps<TValues = FormikValues> = {
  /** Invoked when form is successfully submit */
  onSuccess?: Function;
  initialValues?: TValues;
} & Pick<FormikConfig<TValues>, 'children'>;
