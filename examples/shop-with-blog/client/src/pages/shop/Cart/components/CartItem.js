import React from 'react';
import PropTypes from 'prop-types';
import { UpdateCartItemMutation, RemoveCartItemMutation } from '@deity/falcon-shop-data';
import { Box, Text, Image } from '@deity/falcon-ui';
import { Price, toGridTemplate, PropertyRowLayout } from '@deity/falcon-ui-kit';
import { RemoveItemButton, ChangeItemNumberInput } from './Inputs';

export const CartItemArea = {
  thumb: 'thumb',
  name: 'name',
  remove: 'remove',
  properties: 'properties',
  modify: 'modify',
  price: 'price'
};

const MAX_THUMB_SIZE = '150px';
const cartItemLayout = {
  cartItemLayout: {
    display: 'grid',
    gridGap: 'sm',
    my: 'lg',
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr',                 '1fr'                   ],
        [CartItemArea.name,     CartItemArea.price      ],
        [CartItemArea.thumb,    CartItemArea.properties ],
        [CartItemArea.thumb,    CartItemArea.modify     ],
        [CartItemArea.thumb,    CartItemArea.remove     ]
      ]),
      md: toGridTemplate([
        [MAX_THUMB_SIZE,              '1fr',                     '1fr',                             '100px'            ],
        [CartItemArea.thumb,          CartItemArea.name,        CartItemArea.modify,                CartItemArea.price ],
        [CartItemArea.thumb,          CartItemArea.remove,      CartItemArea.properties,            '1fr'              ]
      ])
    }
  }
};

const CartItemDetails = ({ options = [], ...props }) =>
  options.length ? (
    <Box {...props}>
      {options.map(option => (
        <PropertyRowLayout key={option.label}>
          <Text>{option.label}:</Text>
          <Text>{option.value}</Text>
        </PropertyRowLayout>
      ))}
    </Box>
  ) : null;

CartItemDetails.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

const CartItem = ({ item }) => (
  <Box defaultTheme={cartItemLayout}>
    <Image
      gridArea={CartItemArea.thumb}
      src={item.thumbnailUrl}
      css={{ maxWidth: MAX_THUMB_SIZE, maxHeight: MAX_THUMB_SIZE }}
    />
    <Text gridArea={CartItemArea.name} fontSize="md" fontWeight="bold">
      {item.name}
    </Text>
    <Box gridArea={CartItemArea.remove}>
      <RemoveCartItemMutation>
        {(removeCartItem, { loading }) => (
          <RemoveItemButton
            loading={loading}
            onClick={() => removeCartItem({ variables: { input: { itemId: item.itemId } } })}
          />
        )}
      </RemoveCartItemMutation>
    </Box>
    <Box gridArea={CartItemArea.modify}>
      <UpdateCartItemMutation>
        {(updateCartItem, { loading, error }) => (
          <Box display="flex" alignItems="center">
            <ChangeItemNumberInput
              loading={loading}
              min="1"
              name="qty"
              defaultValue={String(item.qty)}
              onChange={ev => {
                const qty = parseInt(ev.target.value, 10);
                if (!Number.isNaN(qty)) {
                  updateCartItem({
                    variables: {
                      input: {
                        itemId: item.itemId,
                        sku: item.sku,
                        qty
                      }
                    }
                  });
                }
              }}
            />
            {!!error && <Text color="error">{error.message}</Text>}
          </Box>
        )}
      </UpdateCartItemMutation>
    </Box>
    <CartItemDetails gridArea={CartItemArea.properties} options={item.itemOptions} />
    <Price gridArea={CartItemArea.price} value={item.rowTotalInclTax} fontWeight="bold" css={{ textAlign: 'right' }} />
  </Box>
);

CartItem.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    thumbnailUrl: PropTypes.string,
    price: PropTypes.number,
    rowTotalInclTax: PropTypes.number,
    name: PropTypes.string,
    sku: PropTypes.string,
    qty: PropTypes.number,
    itemOptions: PropTypes.arrayOf(PropTypes.shape({}))
  })
};

export default CartItem;
