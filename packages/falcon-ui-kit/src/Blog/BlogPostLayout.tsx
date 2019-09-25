import React from 'react';
import { themed } from '@deity/falcon-ui';

export const BlogPostLayout = themed({
  tag: 'article',
  defaultTheme: {
    blogPostLayout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mb: 'xxl'
    }
  }
});
