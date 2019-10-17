import React from 'react';
import { Value } from 'react-powerplug';
import { T } from '@deity/falcon-i18n';
import { ValidatePasswordTokenQuery } from '@deity/falcon-shop-data';
import { H1 } from '@deity/falcon-ui';
import {
  PageLayout,
  FixCenteredLayout,
  ResetPasswordForm,
  InvalidResetPasswordToken,
  ResetPasswordSuccess
} from '@deity/falcon-ui-kit';
import { OpenSidebarMutation, SIDEBAR_TYPE } from 'src/components/Sidebar';

export default ({ location }) => {
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get('token') || '';

  return (
    <PageLayout>
      <H1>
        <T id="resetPassword.title" />
      </H1>
      <FixCenteredLayout maxWidth={400} gridGap="md">
        <OpenSidebarMutation>
          {openSidebar => (
            <Value initial={false}>
              {({ set, value }) =>
                value ? (
                  <ResetPasswordSuccess
                    onSignIn={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.account } })}
                  />
                ) : (
                  <ValidatePasswordTokenQuery variables={{ token: resetToken }}>
                    {({ data: { validatePasswordToken: isTokenValid } }) =>
                      isTokenValid ? (
                        <ResetPasswordForm resetToken={resetToken} onSuccess={() => set(true)} />
                      ) : (
                        <InvalidResetPasswordToken
                          onRequestAnotherToken={() =>
                            openSidebar({ variables: { contentType: SIDEBAR_TYPE.forgotPassword } })
                          }
                        />
                      )
                    }
                  </ValidatePasswordTokenQuery>
                )
              }
            </Value>
          )}
        </OpenSidebarMutation>
      </FixCenteredLayout>
    </PageLayout>
  );
};
