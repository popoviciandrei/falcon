import React from 'react';
import PropTypes from 'prop-types';
import { Box, BoxProps } from '@deity/falcon-ui';

export type InnerHtmlProps = BoxProps & {
  html: string;
};

/** TODO: think if this component should go into @deity/falcon-ui */
export const InnerHTML: React.SFC<InnerHtmlProps> = ({ html, ...rest }) => (
  <Box {...rest} dangerouslySetInnerHTML={{ __html: html }} />
);
(InnerHTML as any).propTypes = {
  html: PropTypes.string
};
