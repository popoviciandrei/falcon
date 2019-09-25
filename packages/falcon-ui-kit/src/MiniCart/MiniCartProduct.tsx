import React from 'react';
import { Icon, Box, H4, DefaultThemeProps, Image, Link, Text, NumberInput } from '@deity/falcon-ui';
import { I18n } from '@deity/falcon-i18n';
import { RemoveCartItemMutation, UpdateCartItemMutation } from '@deity/falcon-shop-data';
import { toGridTemplate } from '../helpers';
import { Price } from '../Price';

export const MiniCartProductArea = {
  empty: '.',
  thumb: 'thumb',
  price: 'price',
  productName: 'productName',
  modify: 'modify',
  remove: 'remove'
};

const miniCartProductTheme: DefaultThemeProps = {
  miniCartProduct: {
    display: 'grid',
    gridGap: 'xs',
    // prettier-ignore
    gridTemplate: toGridTemplate([
      ['30px',                     '1fr',                     '2fr'                                    ],
      [MiniCartProductArea.empty,  MiniCartProductArea.thumb, MiniCartProductArea.productName          ],
      [MiniCartProductArea.remove, MiniCartProductArea.thumb, MiniCartProductArea.price,          '1fr'],
      [MiniCartProductArea.empty,  MiniCartProductArea.thumb, MiniCartProductArea.modify               ]
    ])
  }
};

export const MiniCartProduct: React.SFC<any> = ({ product }) => (
  <Box defaultTheme={miniCartProductTheme}>
    <Image gridArea={MiniCartProductArea.thumb} src={product.thumbnailUrl} />
    <H4 gridArea={MiniCartProductArea.productName}>{product.name}</H4>
    <Price gridArea={MiniCartProductArea.price} value={product.price} fontSize="md" fontWeight="bold" />
    <RemoveCartItemMutation>
      {removeCartItem => (
        <Link
          gridArea={MiniCartProductArea.remove}
          display="flex"
          alignItems="center"
          onClick={() =>
            removeCartItem({
              variables: { input: { itemId: product.itemId } },
              optimisticResponse: { removeCartItem: { __typename: 'RemoveCartItemPayload', itemId: product.itemId } }
            })
          }
        >
          <Icon
            size="lg"
            stroke="secondaryDark"
            src="remove"
            mr="xs"
            css={({ theme }) => ({ ':hover': { stroke: theme.colors.primary } })}
          />
        </Link>
      )}
    </RemoveCartItemMutation>
    <UpdateCartItemMutation>
      {(updateCartItem, { loading, error }) => (
        <Box gridArea={MiniCartProductArea.modify}>
          <I18n>
            {t => (
              <NumberInput
                disabled={loading}
                min="1"
                name="qty"
                value={product.qty}
                aria-label={t('product.qtyFieldLabel')}
                onChange={ev =>
                  updateCartItem({
                    variables: {
                      input: {
                        itemId: product.itemId,
                        sku: product.sku,
                        qty: parseInt(ev.target.value, 10)
                      }
                    }
                  })
                }
              />
            )}
          </I18n>

          {!!error && <Text color="error">{error.message}</Text>}
        </Box>
      )}
    </UpdateCartItemMutation>
  </Box>
);
