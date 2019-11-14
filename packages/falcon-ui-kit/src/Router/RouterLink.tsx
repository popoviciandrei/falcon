import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Link as UiLink, ThemingProps } from '@deity/falcon-ui';

export type RouterLinkProps = LinkProps & ThemingProps;
export const RouterLink: React.SFC<RouterLinkProps> = props => <UiLink as={Link} {...props} />;
