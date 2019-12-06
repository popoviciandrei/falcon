import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { H1, FlexLayout, GridLayout, Link } from '@deity/falcon-ui';
import {
  Form,
  FormField,
  FormSubmit,
  ErrorSummary,
  TwoColumnsLayout,
  TwoColumnsLayoutArea
} from '@deity/falcon-ui-kit';
import { EditCustomerFormProvider } from '@deity/falcon-front-kit';
import { CustomerQuery } from '@deity/falcon-shop-data';

const PersonalInformation = () => (
  <GridLayout>
    <H1>
      <T id="editCustomer.title" />
    </H1>
    <TwoColumnsLayout>
      <CustomerQuery>
        {({ data: { customer } }) => (
          <EditCustomerFormProvider customer={customer}>
            {({ status }) => (
              <GridLayout as={Form} id="edit-customer" i18nId="editCustomer" gridArea={TwoColumnsLayoutArea.left}>
                <FormField name="firstname" required />
                <FormField name="lastname" required />
                <FormField name="email" type="email" required />
                <FlexLayout justifyContent="space-between" alignItems="center" mt="md">
                  <Link as={RouterLink} to="/account/change-password">
                    <T id="editCustomer.changePassword" />
                  </Link>
                  <FormSubmit />
                </FlexLayout>
                <ErrorSummary errors={status.error} />
              </GridLayout>
            )}
          </EditCustomerFormProvider>
        )}
      </CustomerQuery>
    </TwoColumnsLayout>
  </GridLayout>
);

export default PersonalInformation;
