import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useI18n, T } from '@deity/falcon-i18n';
import { CustomerQuery, useSignOutMutation } from '@deity/falcon-shop-data';
import { useCheckout } from '@deity/falcon-front-kit';
import { Text, Link, Button } from '@deity/falcon-ui';
import { Form, FormField, ErrorSummary, FormSubmit, toGridTemplate } from '@deity/falcon-ui-kit';
import { OpenSidebarMutation, SIDEBAR_TYPE } from 'src/components';
import { CheckoutSection, CheckoutSectionHeader, CheckoutSectionContentLayout } from './components';

const customerEmailFormLayout = {
  customerEmailFormLayout: {
    display: 'grid',
    my: 'xs',
    gridGap: { xs: 'xs', md: 'md' },
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

export const EmailSection = props => {
  const { open, onEdit } = props;
  const { t } = useI18n();
  const [signOut] = useSignOutMutation();
  const { values, setEmail } = useCheckout();

  return (
    <CustomerQuery>
      {({ data: { customer } }) => {
        if (customer && customer.email !== values.email) {
          setEmail(customer.email);
        }

        if (customer || !open) {
          return (
            <CheckoutSection>
              <CheckoutSectionHeader
                title={t('customerSelector.title')}
                complete
                summary={<Text fontWeight="bold">{(customer && customer.email) || values.email}</Text>}
                action={
                  <Button variant="checkout" onClick={customer ? signOut : onEdit}>
                    {t(`customerSelector.${customer ? 'signOut' : 'edit'}`)}
                  </Button>
                }
              />
            </CheckoutSection>
          );
        }

        return (
          <CheckoutSection open={open}>
            <CheckoutSectionHeader title={t('customerSelector.title')} open={open} />
            <CheckoutSectionContentLayout>
              <Text>
                <T id="customerSelector.guestPrompt" />
              </Text>
              <Formik initialValues={{ email: values.email || '' }} onSubmit={x => setEmail(x.email)}>
                {({ status }) => (
                  <Form id="checkout-customer-email" i18nId="customerSelector" defaultTheme={customerEmailFormLayout}>
                    <FormField name="email" required type="email" autoComplete="email" gridArea="input" />
                    <FormSubmit my="xs" gridArea="button" />
                    {status && status.error && <ErrorSummary errors={status.error} />}
                  </Form>
                )}
              </Formik>
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
            </CheckoutSectionContentLayout>
          </CheckoutSection>
        );
      }}
    </CustomerQuery>
  );
};
EmailSection.propTypes = {
  // callback that should be called when user requests edit of this particular section
  onEdit: PropTypes.func,
  // flag that indicates if the section is currently open
  open: PropTypes.bool
};
