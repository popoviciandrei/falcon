import React from 'react';
import PropTypes from 'prop-types';
import { themed, Text } from '@deity/falcon-ui';
import { Locale, PriceFormatOptions } from '@deity/falcon-front-kit';

export type PriceProps = {
  value: number;
  /** passing formatting options may not use memoized formatter, so the performance penalty could be paid */
  formatOptions?: PriceFormatOptions;
  ellipsis: boolean;
};
const PriceInnerDom: React.SFC<PriceProps> = props => {
  const { value, formatOptions, children, ...rest } = props;

  return (
    <Locale>
      {({ priceFormat }) => (
        <Text m="lg" {...rest}>
          {priceFormat(value, formatOptions)}
        </Text>
      )}
    </Locale>
  );
};
PriceInnerDom.propTypes = {
  value: PropTypes.number.isRequired
};

export const Price = themed<PriceProps, {}>({
  tag: PriceInnerDom,
  defaultProps: {
    value: 0.0,
    formatOptions: undefined,
    ellipsis: false
  },
  defaultTheme: {
    price: {
      display: 'block',
      m: 'none',
      css: {
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      },
      variants: {
        old: {
          css: {
            textDecorationStyle: 'solid',
            textDecorationLine: 'line-through'
          }
        },
        special: {
          fontWeight: 'bold',
          css: {
            color: 'red'
          }
        }
      }
    }
  }
});
