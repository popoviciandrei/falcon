import React from 'react';
import { T } from '@deity/falcon-i18n';
import { GridLayout, H4, List, ListItem } from '@deity/falcon-ui';
import { LocaleSwitcher } from '@deity/falcon-front-kit';
import {
  Footer,
  LocalePicker,
  Newsletter,
  Copyright,
  FooterBanner,
  RouterLink,
  FooterSectionListLayout,
  FooterSectionLayout
} from '@deity/falcon-ui-kit';

const FooterLink = ({ to, children }) => (
  <ListItem p="xs">
    <RouterLink to={to}>{children}</RouterLink>
  </ListItem>
);

const Sitemap = () => (
  <FooterSectionListLayout>
    <FooterSectionLayout>
      <H4 fontWeight="bold">
        <T id="sitemap.customerService" />
      </H4>
      <List>
        <FooterLink to="/">
          <T id="sitemap.trackOrderLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.returnPolicyLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.faqsLink" />
        </FooterLink>
      </List>
    </FooterSectionLayout>
    <FooterSectionLayout>
      <H4 fontWeight="bold">
        <T id="sitemap.aboutUs" />
      </H4>
      <List>
        <FooterLink to="/">
          <T id="sitemap.aboutUsLink" />
        </FooterLink>
        <FooterLink to="/blog">
          <T id="sitemap.blogLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.jobsLink" />
        </FooterLink>
      </List>
    </FooterSectionLayout>
    <FooterSectionLayout>
      <H4 fontWeight="bold">
        <T id="sitemap.terms" />
      </H4>
      <List>
        <FooterLink to="/">
          <T id="sitemap.cookiesLink" />
        </FooterLink>
        <FooterLink to="/">
          <T id="sitemap.termsLink" />
        </FooterLink>
      </List>
    </FooterSectionLayout>
  </FooterSectionListLayout>
);

export const PageFooter = () => (
  <GridLayout as={Footer} gridGap="md">
    <Newsletter />
    <Sitemap />
    <LocaleSwitcher>{({ ...props }) => <LocalePicker {...props} />}</LocaleSwitcher>
    <FooterBanner>
      <Copyright />
    </FooterBanner>
  </GridLayout>
);
