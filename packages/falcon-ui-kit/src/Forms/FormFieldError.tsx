import { Box, themed } from '@deity/falcon-ui';
import { FormFieldArea } from './FormFieldLayout';

export const FormFieldError = themed({
  tag: Box,
  defaultProps: {
    gridArea: FormFieldArea.error
  },
  defaultTheme: {
    formFieldError: {
      gridArea: FormFieldArea.error,
      color: 'error',
      fontSize: 'xxs',
      css: {
        pointerEvents: 'none',
        justifySelf: 'end'
      }
    }
  }
});
