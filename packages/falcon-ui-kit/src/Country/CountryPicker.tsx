import React, { useMemo } from 'react';
import { Country } from '@deity/falcon-shop-extension';
import { SelectInput, SelectInputProps } from '../Forms';

export type CountryPickerItem = Pick<Country, 'id' | 'code' | 'localName'>;

export type CountryPickerProps = Omit<SelectInputProps, 'options' | 'onChange'> & {
  options: CountryPickerItem[];
  value: CountryPickerItem;
  onChange: (value: CountryPickerItem) => any;
};

export const CountryPicker: React.SFC<CountryPickerProps> = ({ value, options, onChange, ...rest }) => {
  const selectOptions = useMemo(
    () =>
      options.map(({ code, localName }) => ({
        value: code,
        label: localName || code
      })),
    [options]
  );

  return (
    <SelectInput
      {...rest}
      value={value ? value.code : undefined}
      options={selectOptions}
      onChange={e => {
        return onChange(options.find(x => x.code === e.target.value));
      }}
    />
  );
};
