import { themed } from '../theme';

export type TextProps = Parameters<typeof Text>[0];
export const Text = themed({
  tag: 'p',
  defaultProps: {
    ellipsis: false
  },
  defaultTheme: {
    text: {
      display: 'block',
      m: 'none',
      css: ({ ellipsis }) => (ellipsis ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {})
    }
  }
});
