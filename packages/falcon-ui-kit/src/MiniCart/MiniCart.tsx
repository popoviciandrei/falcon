import React from 'react';
import { Icon, List, ListItem, Box, Divider, Button } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { MiniCartResponse } from '@deity/falcon-shop-data';
import { prettyScrollbars } from '../helpers';
import { MiniCartProduct } from './MiniCartProduct';
import { MiniCartLayout, MiniCartLayoutArea } from './MiniCartLayout';

export type MiniCartProps = {
  onCheckout: Function;
  items: MiniCartResponse['cart']['items'][0][];
};
export const MiniCart: React.SFC<MiniCartProps> = ({ onCheckout, items }) => (
  <MiniCartLayout>
    <Box gridArea={MiniCartLayoutArea.items} css={props => ({ ...prettyScrollbars(props.theme) })}>
      <List>
        {items.map((item, index: number) => {
          const isLastItem = index === items.length - 1;

          return (
            <ListItem key={item.sku} pb="none">
              <MiniCartProduct product={item} />
              {!isLastItem && <Divider my="md" />}
            </ListItem>
          );
        })}
      </List>
    </Box>
    <Box gridArea={MiniCartLayoutArea.cta} py="sm" bgFullWidth="secondaryLight">
      <Button onClick={() => onCheckout()} css={{ width: '100%' }} height="xl">
        <Icon stroke="white" size="md" mr="xs" src="lock" />
        <T id="miniCart.checkout" />
      </Button>
    </Box>
  </MiniCartLayout>
);
