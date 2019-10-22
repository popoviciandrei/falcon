import React from 'react';
import { Icon, ListItem, themed } from '@deity/falcon-ui';

const SelectedFilterItemLayoutInnerDOM: React.SFC<any> = ({ onClick, children, ...rest }) => (
  <ListItem {...rest}>
    <Icon
      src="close"
      size="md"
      mr="xs"
      onClick={() => onClick && onClick()}
      css={({ theme }) => ({
        cursor: onClick ? 'pointer' : undefined,
        ':hover': {
          stroke: theme.colors.primaryLight
        }
      })}
    />
    {children}
  </ListItem>
);

export const SelectedFilterItemLayout = themed({
  tag: SelectedFilterItemLayoutInnerDOM,
  defaultTheme: {
    selectedFilterItemLayout: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      pr: 'xs',
      pb: 'xs'
    }
  }
});
