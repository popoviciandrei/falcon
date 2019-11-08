import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/react-hoc';
import { Formik } from 'formik';
import { SignOutMutation, GET_CUSTOMER } from '@deity/falcon-shop-data';
import { Box, Text, Link, Details, DetailsContent } from '@deity/falcon-ui';
import { Form, FormField, ErrorSummary, FormSubmit, toGridTemplate } from '@deity/falcon-ui-kit';
import { I18n, T } from '@deity/falcon-i18n';
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
  const { open, data: { customer } = {}, onEditRequested, setEmail, email } = props;

  if (customer) {
    setEmail(customer.email);
    // TODO: go to next step;
  }

  return (
    <I18n>
      {t => (
        <Details open={open}>
          {!open && (
            <SignOutMutation>
              {signOut => (
                <SectionHeader
                  title={t('customerSelector.title')}
                  editLabel={t(customer ? 'customerSelector.signOut' : 'customerSelector.edit')}
                  onActionClick={customer ? signOut : onEditRequested}
                  complete
                  summary={<Text>{email}</Text>}
                />
              )}
            </SignOutMutation>
          )}
          {open && (
            <React.Fragment>
              <SectionHeader title={t('customerSelector.title')} />
              <DetailsContent>
                <Text>
                  <T id="customerSelector.guestPrompt" />
                </Text>
                <EmailForm email={email} setEmail={setEmail} />
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
      )}
    </I18n>
  );
};
EmailSection.defaultProps = {
  email: ''
};
EmailSection.propTypes = {
  // data form GET_CUSTOMER query
  data: PropTypes.shape({}),
  // currently selected email
  email: PropTypes.string,
  // callback that sets email
  setEmail: PropTypes.func.isRequired,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag that indicates if the section is currently open
  open: PropTypes.bool
};

export default graphql(GET_CUSTOMER)(EmailSection);
