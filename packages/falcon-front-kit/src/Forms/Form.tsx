import React from 'react';
import PropTypes from 'prop-types';
import { Form as FormikForm, FormikFormProps, useFormikContext } from 'formik';
import { Loader } from '@deity/falcon-data';
import { FormContext, FormContextValue } from './FormContext';

export type FormProps = FormContextValue &
  FormikFormProps & {
    autoSubmit: boolean;
  };

export const Form: React.SFC<FormProps> = ({ i18nId, autoSubmit, ...restProps }) => {
  const { submitCount, isValid, submitForm, isSubmitting } = useFormikContext();

  if (autoSubmit) {
    if (!isSubmitting && submitCount === 0 && isValid) {
      submitForm();
      return null;
    }
    if (isSubmitting && submitCount <= 1) {
      return null;
    }
  }

  return (
    <FormContext.Provider
      value={{
        id: restProps.id,
        name: restProps.name,
        i18nId
      }}
    >
      <FormikForm {...restProps} />
    </FormContext.Provider>
  );
};
Form.propTypes = {
  id: PropTypes.string.isRequired
};
