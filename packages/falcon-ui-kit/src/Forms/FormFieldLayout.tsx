import React from 'react';
import { Box, themed } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const FormFieldArea = {
  label: 'label',
  input: 'input',
  error: 'error'
};

export const FormFieldLayout = themed({
  tag: Box,
  defaultTheme: {
    formFieldLayout: {
      display: 'grid',
      gridGap: 'xs',
      // prettier-ignore
      gridTemplate: toGridTemplate([
        ['1fr'                     ],
        [FormFieldArea.label       ],
        [FormFieldArea.input       ],
        [FormFieldArea.error, '0px']
      ])
    }
  }
});
