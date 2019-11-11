import React, { useMemo } from 'react';
import { addressToString } from '@deity/falcon-front-kit';
import { Picker } from '@deity/falcon-ui-kit';

export const AddressPicker = ({ options, selected, onChange }) => {
  const isOtherAddressSelected = selected && !selected.id;
  const pickerOptions = useMemo(
    () => [
      ...options.map(value => ({ value, label: addressToString(value) })),
      isOtherAddressSelected ? { label: 'Other', value: selected } : { label: 'Other', value: undefined }
    ],
    [options, selected]
  );

  return (
    <Picker
      options={pickerOptions}
      selected={selected && selected.id ? addressToString(selected) : 'Other'}
      onChange={onChange}
    />
  );
};
