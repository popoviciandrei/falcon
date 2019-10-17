import { themed } from '../theme';

export type BoxProps = Parameters<typeof Box>[0];
export const Box = themed({
  tag: 'div'
});
