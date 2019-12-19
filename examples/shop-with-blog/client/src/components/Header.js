import React from 'react';
import { withRouter } from 'react-router-dom';
import { MenuQuery, CustomerQuery, CartQuery, SignOutMutation } from '@deity/falcon-shop-data';
import { T } from '@deity/falcon-i18n';
import { Link, ListItem, Icon } from '@deity/falcon-ui';
import { RouterLink, MenuNavbar, HeaderBanner, CartIcon, HeaderBarLayout, HeaderBarArea } from '@deity/falcon-ui-kit';
import { OpenSidebarMutation, SIDEBAR_TYPE } from 'src/components';

export const Header = withRouter(({ history }) => (
  <CustomerQuery>
    {({ data: { customer } }) => (
      <header>
        <HeaderBanner>
          {customer && (
            <ListItem>
              <SignOutMutation>
                {signOut => (
                  <Link onClick={() => signOut().then(() => history.push('/'))}>
                    <T id="signOut.link" />
                  </Link>
                )}
              </SignOutMutation>
            </ListItem>
          )}
          <ListItem>
            <RouterLink to="#">
              <T id="banner.contactLink" />
            </RouterLink>
          </ListItem>
          <ListItem>
            <RouterLink to="/blog">
              <T id="banner.blogLink" />
            </RouterLink>
          </ListItem>
        </HeaderBanner>
        <OpenSidebarMutation>
          {openSidebar => (
            <HeaderBarLayout>
              <RouterLink gridArea={HeaderBarArea.logo} to="/" aria-label="DEITY">
                <Icon src="logo" size="xxl" />
              </RouterLink>
              {customer ? (
                <RouterLink gridArea={HeaderBarArea.signIn} to="/account">
                  <Icon src="account" />
                </RouterLink>
              ) : (
                <Link
                  gridArea={HeaderBarArea.signIn}
                  onClick={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.account } })}
                >
                  <Icon src="signIn" />
                </Link>
              )}
              <Link
                gridArea={HeaderBarArea.cart}
                onClick={() => openSidebar({ variables: { contentType: SIDEBAR_TYPE.cart } })}
              >
                <CartQuery ssr={false}>
                  {({ data: { cart } }) => <CartIcon itemsQty={cart && cart.itemsQty} />}
                </CartQuery>
              </Link>
            </HeaderBarLayout>
          )}
        </OpenSidebarMutation>
        <nav>
          <MenuQuery>{({ data: { menu } }) => <MenuNavbar items={menu} />}</MenuQuery>
        </nav>
      </header>
    )}
  </CustomerQuery>
));
