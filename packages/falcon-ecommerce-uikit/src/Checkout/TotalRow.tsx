import React from 'react';
import { Box, Text } from '@deity/falcon-ui';
import { Price } from '../Locale';

export type TotalRowProps = {
  title: string;
  value: number;
};
export const TotalRow: React.SFC<TotalRowProps> = ({ title, value, ...props }) => (
  <Box display="flex" {...props}>
    <Text flex="1">{title}</Text>
    <Price value={value} />
  </Box>
);
