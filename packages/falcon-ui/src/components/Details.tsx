import { themed } from '../theme';

export const Details = themed({
  tag: 'details',

  defaultProps: {
    open: false
  },

  defaultTheme: {
    details: {
      display: 'flex',
      flexDirection: 'column',

      css: ({ theme, open }) => ({
        '> :not(summary, style)': {
          display: open ? 'block' : 'none',
          flex: open ? '1' : 0
        },

        '> summary::-webkit-details-marker': {
          display: 'none'
        },

        '> summary:after': {
          display: 'block',
          content: open ? '"-"' : '"+"',
          marginLeft: theme.spacing.sm,
          fontSize: theme.fontSizes.md,
          lineHeight: 0.6,
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.secondaryText
        }
      })
    }
  }
});

export const Summary = themed({
  tag: 'summary',

  defaultTheme: {
    summary: {
      fontSize: 'sm',
      py: 'xs',
      px: 'sm',
      mb: 'xs',
      bg: 'secondaryLight',
      lineHeight: 'small',
      borderRadius: 'medium',

      css: {
        outline: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative'
      }
    }
  }
});

export const DetailsContent = themed({
  tag: 'article',

  defaultTheme: {
    detailsContent: {
      py: 'xs',
      pl: 'xs'
    }
  }
});
