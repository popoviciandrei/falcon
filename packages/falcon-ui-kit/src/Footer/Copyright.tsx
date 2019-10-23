import React from 'react';
import { Text, themed } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';

const CopyrightInnerDOM = props => (
  <Text {...props}>
    <T id="copyright" year={new Date().getFullYear()} />
  </Text>
);

export const Copyright = themed({
  tag: CopyrightInnerDOM,
  defaultTheme: {
    copyright: {
      p: 'sm',
      color: 'secondaryText'
    }
  }
});
