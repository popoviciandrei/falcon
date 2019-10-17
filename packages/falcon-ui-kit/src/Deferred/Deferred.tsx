import React from 'react';
import PropTypes from 'prop-types';
import { Box, ThemedComponentProps } from '@deity/falcon-ui';

export type DeferredProps = {
  type: string | number;
  until: string | number;
};

/**
 * React (^16.6) will consider rendering it in a low priority due to `hidden` attribute usage
 * @see https://github.com/oliviertassinari/react-swipeable-views/issues/453#issuecomment-417939459
 */
export const Deferred: React.SFC<DeferredProps & ThemedComponentProps<DeferredProps>> = ({
  until,
  type,
  children,
  ...rest
}) => {
  const isHidden = until !== type;

  return (
    <Box key={`${type}-${isHidden}`} hidden={isHidden} {...(rest as any)}>
      {children}
    </Box>
  );
};
Deferred.propTypes = {
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  until: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
