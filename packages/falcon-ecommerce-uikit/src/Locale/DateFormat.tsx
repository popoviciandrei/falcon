import React from 'react';
import PropTypes from 'prop-types';
import { themed, Text } from '@deity/falcon-ui';
import { Locale, DateTimeFormatOptions } from './LocaleContext';

type DateFormatProps = {
  value: number | string | Date;
  /** passing formatting options may not use memoized formatter, so the performance penalty could be paid */
  formatOptions?: DateTimeFormatOptions;
};

const DateFormatInnerDOM: React.SFC<DateFormatProps> = ({ value, formatOptions, ...rest }) => (
  <Locale>{({ dateTimeFormat }) => <Text {...rest}>{dateTimeFormat(value, formatOptions)}</Text>}</Locale>
);
DateFormatInnerDOM.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
};

export const DateFormat = themed({
  tag: DateFormatInnerDOM,
  defaultProps: {
    formatOptions: undefined
  },
  defaultTheme: {
    price: {
      display: 'block',
      m: 'none'
    }
  }
});
