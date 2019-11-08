import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useI18n, T } from '@deity/falcon-i18n';
import { CustomerQuery, useSignOutMutation } from '@deity/falcon-shop-data';
import { useCheckout } from '@deity/falcon-front-kit';
import { Box, Text, Link, Details, DetailsContent } from '@deity/falcon-ui';
import { Form, FormField, ErrorSummary, FormSubmit, toGridTemplate } from '@deity/falcon-ui-kit';
import { OpenSidebarMutation, SIDEBAR_TYPE } from 'src/components';
import SectionHeader from './CheckoutSectionHeader';

const customerEmailFormLayout = {
  customerEmailFormLayout: {
    display: 'grid',
    my: 'xs',
    gridGap: 'sm',
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr'],
        ['input'],
        ['button']
      ]),
      md: toGridTemplate([
        ['2fr', '1fr'],
        ['input', 'button']
      ])
    }
  }
};

const EmailForm = ({ email = '', setEmail }) => (
  <Formik initialStatus={{}} initialValues={{ email }} onSubmit={values => setEmail(values.email)}>
    {({ status: { error } }) => (
      <Form id="checkout-customer-email" i18nId="customerSelector">
        <Box defaultTheme={customerEmailFormLayout}>
          <Box gridArea="input">
            <FormField name="email" required type="email" autoComplete="email" />
          </Box>
          <FormSubmit gridArea="button" my="xs" />
          {error && <ErrorSummary errors={error} />}
        </Box>
      </Form>
    )}
  </Formik>
);
EmailForm.propTypes = {
  setEmail: PropTypes.func.isRequired,
  email: PropTypes.string
};

export const EmailSection = props => {
  const { open, onEditRequested } = props;
  const { t } = useI18n();
  const { setEmail, values } = useCheckout();
  const [signOut] = useSignOutMutation();

  return (
    <CustomerQuery>
      {({ data: { customer } }) => {
        if (customer) {
          setEmail(customer.email);
          // TODO: go to next step;

          return (
            <Details>
              <SectionHeader
                title={t('customerSelector.title')}
                editLabel={t('customerSelector.edit')}
                onActionClick={signOut}
                complete
                summary={<Text>{customer.email || values.email}</Text>}
              />
            </Details>
          );
        }

        return (
          <Details open={open}>
            {!open && (
              <SectionHeader
                title={t('customerSelector.title')}
                editLabel={t('customerSelector.edit')}
                onActionClick={onEditRequested}
                complete
                summary={<Text>{values.email}</Text>}
              />
            )}
            {open && (
              <React.Fragment>
                <SectionHeader title={t('customerSelector.title')} />
                <DetailsContent>
                  <Text>
                    <T id="customerSelector.guestPrompt" />
                  </Text>
                  <EmailForm email={values.email} setEmail={setEmail} />
                  <Text>
                    <T id="customerSelector.or" />
                    <OpenSidebarMutation>
                      {openSidebar => (
                        <Link
                          mx="xs"
                          color="primary"
                          onClick={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.account } })}
                        >
                          <T id="customerSelector.signInLink" />
                        </Link>
                      )}
                    </OpenSidebarMutation>
                    <T id="customerSelector.ifAlreadyRegistered" />
                  </Text>
                </DetailsContent>
              </React.Fragment>
            )}
          </Details>
        );
      }}
    </CustomerQuery>
  );
};
EmailSection.propTypes = {
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag that indicates if the section is currently open
  open: PropTypes.bool
};
