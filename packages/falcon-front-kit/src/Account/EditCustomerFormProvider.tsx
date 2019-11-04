import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { EditCustomerInput, Customer } from '@deity/falcon-shop-extension';
import { useEditCustomerMutation } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type EditCustomerFormValues = EditCustomerInput;
export type EditCustomerFormProviderProps = FormProviderProps<EditCustomerFormValues> & {
  customer: Pick<Customer, 'websiteId' | 'firstname' | 'lastname' | 'email'>;
};
export const EditCustomerFormProvider: React.SFC<EditCustomerFormProviderProps> = props => {
  const { onSuccess, initialValues, customer, ...formikProps } = props;
  const defaultInitialValues: EditCustomerFormValues = {
    websiteId: customer.websiteId,
    email: customer.email,
    firstname: customer.firstname,
    lastname: customer.lastname
  };

  const [editCustomerMutation] = useEditCustomerMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        editCustomerMutation({ variables: { input: values } })
          .then(() => {
            setSubmitting(false);
            return onSuccess && onSuccess();
          })
          .catch(e => {
            const error = getUserError(e);
            if (error.length) {
              setStatus({ error });
              setSubmitting(false);
            }
          })
      }
      {...formikProps}
    />
  );
};
