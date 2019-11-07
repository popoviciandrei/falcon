import React from 'react';
import { Select, Option, ThemedComponentProps } from '@deity/falcon-ui';

export type SelectInputOption = {
  value: string | number;
  label: string;
};
export type SelectInputProps = ThemedComponentProps &
  React.InputHTMLAttributes<HTMLSelectElement> & {
    options: SelectInputOption[];
  };
export const SelectInput: React.SFC<SelectInputProps> = ({ options, ...rest }) => {
  return (
    <Select {...rest}>
      {options.map(x => (
        <Option key={`${x.value}-${x.label}`} value={x.value}>
          {x.label}
        </Option>
      ))}
    </Select>
  );
};
