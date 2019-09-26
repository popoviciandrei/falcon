import React from 'react';
import PropTypes from 'prop-types';
import { Box, ThemedComponentProps } from '@deity/falcon-ui';

export type InnerHtmlProps = {
  html: string;
} & ThemedComponentProps<any>;

/** TODO: think if this component should go into @deity/falcon-ui */
export const InnerHTML: React.SFC<InnerHtmlProps> = ({ html, ...rest }) => (
  <Box {...(rest as any)} dangerouslySetInnerHTML={{ __html: html }} />
);
(InnerHTML as any).propTypes = {
  html: PropTypes.string
};
