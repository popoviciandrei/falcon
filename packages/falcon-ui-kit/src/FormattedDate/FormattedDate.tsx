import React from 'react';
import PropTypes from 'prop-types';
import { themed, Text } from '@deity/falcon-ui';
import { useLocale, DateTimeFormatOptions } from '@deity/falcon-front-kit';

type FormattedDateProps = {
  value: number | string | Date;
  /** passing formatting options may not use memoized formatter, so the performance penalty could be paid */
  formatOptions?: DateTimeFormatOptions;
};

const FormattedDateInnerDOM: React.SFC<FormattedDateProps> = ({ value, formatOptions, ...rest }) => {
  const { dateTimeFormat } = useLocale();

  return <Text {...rest}>{dateTimeFormat(value, formatOptions)}</Text>;
};
FormattedDateInnerDOM.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]).isRequired
};

export const FormattedDate = themed({
  tag: FormattedDateInnerDOM,
  defaultProps: {
    formatOptions: undefined
  },
  defaultTheme: {
    formattedDate: {
      display: 'block',
      m: 'none'
    }
  }
});
