import React from 'react';
import { I18n } from '@deity/falcon-i18n';
import { MiniCartQuery } from '@deity/falcon-shop-data';
import { Router } from '@deity/falcon-front-kit';
import { Divider } from '@deity/falcon-ui';
import {
  SidebarLayout,
  NewAccount,
  SignInForm,
  SignUpForm,
  EmptyMiniCart,
  MiniCart,
  ForgotPasswordForm,
  Deferred
} from '@deity/falcon-ui-kit';
import { SIDEBAR_TYPE } from 'src/components';

export default ({ contentType, open, close }) => {
  // if there is no content type provided it means that sidebar contents should be rendered as hidden
  // if unrecognized content type is provided add warning about it
  if (contentType && !SIDEBAR_TYPE[contentType]) {
    const message = `Unrecognized sidebar content type: ${contentType}`;
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(message);
    }

    console.error(message);
  }

  return (
    <Router>
      {({ history }) => (
        <I18n>
          {t => (
            <React.Fragment>
              <Deferred type={SIDEBAR_TYPE.cart} until={contentType} flex={1}>
                <SidebarLayout title={t('miniCart.title')} onClose={close}>
                  <MiniCartQuery>
                    {({ data: { cart = { items: [] } } }) =>
                      cart.items.length > 0 ? (
                        <MiniCart items={cart.items} onCheckout={() => close().then(() => history.push('/cart'))} />
                      ) : (
                        <EmptyMiniCart onGoShopping={() => close().then(() => history.push('/what-is-new.html'))} />
                      )
                    }
                  </MiniCartQuery>
                </SidebarLayout>
              </Deferred>
              <Deferred type={SIDEBAR_TYPE.account} until={contentType} flex={1}>
                <SidebarLayout title={t('signIn.title')} onClose={close}>
                  <SignInForm
                    id="sign-in-sidebar"
                    onSuccess={close}
                    mutationOptions={{ awaitRefetchQueries: true }}
                    onForgotPassword={() => open({ variables: { contentType: SIDEBAR_TYPE.forgotPassword } })}
                  />
                  <Divider my="lg" />
                  <NewAccount onCreateNewAccount={() => open({ variables: { contentType: SIDEBAR_TYPE.signUp } })} />
                </SidebarLayout>
              </Deferred>
              <Deferred type={SIDEBAR_TYPE.signUp} until={contentType} flex={1}>
                <SidebarLayout title={t('signUp.title')} onClose={close}>
                  <SignUpForm onSuccess={() => open({ variables: { contentType: SIDEBAR_TYPE.account } })} />
                </SidebarLayout>
              </Deferred>
              <Deferred type={SIDEBAR_TYPE.forgotPassword} until={contentType} flex={1}>
                <SidebarLayout title={t('forgotPassword.title')} onClose={close}>
                  <ForgotPasswordForm />
                </SidebarLayout>
              </Deferred>
            </React.Fragment>
          )}
        </I18n>
      )}
    </Router>
  );
};
