import React from 'react';
import { T } from '@deity/falcon-i18n';
import { H1, Divider } from '@deity/falcon-ui';
import { PageLayout, FixCenteredLayout, SignInForm, NewAccount } from '@deity/falcon-ui-kit';
import { OpenSidebarMutation, SIDEBAR_TYPE } from 'src/components';

const SignIn = ({ history, location }) => {
  const { search } = location;

  const queryParams = new URLSearchParams(search);
  const next = queryParams.get('next') || '/';

  return (
    <PageLayout>
      <H1>
        <T id="signIn.title" />
      </H1>
      <OpenSidebarMutation>
        {openSidebar => (
          <FixCenteredLayout maxWidth={400}>
            <SignInForm
              id="sign-in-page"
              onSuccess={() => history.replace(next)}
              onForgotPassword={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.forgotPassword } })}
            />
            <Divider my="lg" />
            <NewAccount onCreateNewAccount={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.signUp } })} />
          </FixCenteredLayout>
        )}
      </OpenSidebarMutation>
    </PageLayout>
  );
};

export default SignIn;
