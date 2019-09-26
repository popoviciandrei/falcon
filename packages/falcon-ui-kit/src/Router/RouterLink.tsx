import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Link as UiLink, ThemedComponentProps } from '@deity/falcon-ui';

export type RouterLinkProps = LinkProps & ThemedComponentProps;
export const RouterLink: React.SFC<RouterLinkProps> = props => <UiLink as={Link} {...props} />;
