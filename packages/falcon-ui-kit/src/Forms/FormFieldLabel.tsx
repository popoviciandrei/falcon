import { Label, themed } from '@deity/falcon-ui';
import { FormFieldArea } from './FormFieldLayout';

export const FormFieldLabel = themed({
  tag: Label,
  defaultProps: {
    gridArea: FormFieldArea.label
  }
});
