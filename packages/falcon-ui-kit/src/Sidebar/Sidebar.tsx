import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar as FalconSidebar, Portal, Backdrop, Icon, Box } from '@deity/falcon-ui';

export type SidebarSide = 'left' | 'right';
export type SidebarProps = {
  isOpen: boolean;
  side: SidebarSide;
  close: Function;
};
export const Sidebar: React.SFC<SidebarProps> = ({ close, isOpen, side, children }) => (
  <>
    <FalconSidebar as={Portal} visible={isOpen} side={side}>
      {children}
    </FalconSidebar>
    <Backdrop as={Portal} visible={isOpen} onClick={() => close && close()} />
  </>
);

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  side: PropTypes.oneOf(['left', 'right'])
};
Sidebar.defaultProps = {
  side: 'right'
};
