import React from 'react';
import { T } from '@deity/falcon-i18n';
import { H1 } from '@deity/falcon-ui';
import { PageLayout } from '@deity/falcon-ui-kit';
import { HomeProducts } from './components/HomeProducts';

const Home = () => (
  <PageLayout>
    <H1 css={{ textAlign: 'center' }}>
      <T id="home.hotSellers" />
    </H1>
    <HomeProducts />
  </PageLayout>
);

export default Home;
