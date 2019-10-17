import React from 'react';
import { themed } from '@deity/falcon-ui';
import { InnerHTML, InnerHtmlProps } from '../InnerHtml';

export type CMSContentProps = InnerHtmlProps;

export const CMSContent = themed<CMSContentProps, any>({
  tag: InnerHTML,
  defaultTheme: {
    cmsContent: {
      fontSize: 'md',
      css: ({ theme }) => ({
        maxWidth: 740,
        margin: '0 auto',

        p: {
          margiTop: 0,
          marginBottom: theme.spacing.md
        },
        img: {
          objectFit: 'contain',
          maxWidth: '100%'
        },
        figure: {
          marginBottom: theme.spacing.xxl
        }
      })
    }
  }
});
