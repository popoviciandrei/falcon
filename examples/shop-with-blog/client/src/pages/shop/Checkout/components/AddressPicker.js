import React, { useMemo } from 'react';
import { addressToString } from '@deity/falcon-front-kit';
import { Picker } from '@deity/falcon-ui-kit';

export const AddressPicker = ({ options, selected, onChange }) => {
  const pickerOptions = useMemo(
    () => [...options.map(value => ({ value, label: addressToString(value) })), { value: 'Other', label: 'Other' }],
    [options]
  );

  return (
    <Picker
      options={pickerOptions}
      selected={selected && typeof selected === 'object' ? addressToString(selected) : selected}
      onChange={value => onChange(value)}
    />
  );
};
