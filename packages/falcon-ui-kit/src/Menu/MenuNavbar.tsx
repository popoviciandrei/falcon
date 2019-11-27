import React from 'react';
import { Navbar, NavbarItem, NavbarItemMenu, List, ListItem } from '@deity/falcon-ui';
import { RouterLink } from '../Router';

export type NavbarItem = {
  name: string;
  urlPath: string;
  children?: NavbarItem[];
};
export type MenuNavbarProps = {
  items: NavbarItem[];
};
export const MenuNavbar: React.SFC<MenuNavbarProps> = ({ items }) => (
  <Navbar>
    {items.map(item => (
      <NavbarItem key={item.urlPath}>
        <RouterLink p="sm" to={item.urlPath}>
          {item.name}
        </RouterLink>

        {item.children && item.children.length > 0 && (
          <NavbarItemMenu>
            <List>
              {item.children.map(subItem => (
                <ListItem key={subItem.urlPath}>
                  <RouterLink p="xs" display="block" to={subItem.urlPath}>
                    {subItem.name}
                  </RouterLink>
                </ListItem>
              ))}
            </List>
          </NavbarItemMenu>
        )}
      </NavbarItem>
    ))}
  </Navbar>
);
