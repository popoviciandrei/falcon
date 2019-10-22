import React from 'react';
import { Country } from '@deity/falcon-shop-extension';
import { SelectInput, SelectInputProps } from '../Forms';

export type CountryPickerProps = Omit<SelectInputProps, 'options'> & {
  options: Pick<Country, 'code' | 'localName'>[];
};

export const CountryPicker: React.SFC<CountryPickerProps> = ({ options, ...rest }) => (
  <SelectInput {...rest} options={options.map(({ code, localName }) => ({ value: code, label: localName }))} />
);
