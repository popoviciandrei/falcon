import React from 'react';
import { Formik } from 'formik';
import { useGetUserError } from '@deity/falcon-data';
import { EditCustomerInput, Customer } from '@deity/falcon-shop-extension';
import { useEditCustomerMutation, EditCustomerResponse } from '@deity/falcon-shop-data';
import { FormProviderProps } from '../Forms';

export type EditCustomerFormProviderProps = FormProviderProps<EditCustomerInput, EditCustomerResponse> & {
  customer: Pick<Customer, 'websiteId' | 'firstname' | 'lastname' | 'email'>;
};
export const EditCustomerFormProvider: React.SFC<EditCustomerFormProviderProps> = props => {
  const { onSuccess, initialValues, customer, ...formikProps } = props;
  const defaultInitialValues: EditCustomerInput = {
    websiteId: customer.websiteId,
    email: customer.email,
    firstname: customer.firstname,
    lastname: customer.lastname
  };

  const [editCustomerMutation] = useEditCustomerMutation();
  const [getUserError] = useGetUserError();

  return (
    <Formik
      initialStatus={{}}
      initialValues={initialValues || defaultInitialValues}
      onSubmit={(values, { setSubmitting, setStatus }) =>
        editCustomerMutation({ variables: { input: values } })
          .then(({ data }) => {
            setSubmitting(false);
            setStatus({ data });
            return onSuccess && onSuccess(data);
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
