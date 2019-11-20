import React from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';

export type AutoSubmitProps = {
  when?: boolean;
};
export const AutoSubmit: React.FC<AutoSubmitProps> = ({ when }) => {
  const { submitCount, isValid, submitForm } = useFormikContext();

  if (submitCount === 0 && isValid && when) {
    submitForm();
  }

  return null;
};
AutoSubmit.propTypes = {
  when: PropTypes.bool
};
AutoSubmit.defaultProps = {
  when: true
};
