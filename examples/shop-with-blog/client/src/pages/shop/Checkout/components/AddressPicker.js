import React, { useMemo } from 'react';
import { addressToString } from '@deity/falcon-front-kit';
import { Picker } from '@deity/falcon-ui-kit';

export const isCustomAddress = address => !address || (address && !address.id);

export const AddressPicker = ({ options, selected, onChange }) => {
  const pickerOptions = useMemo(() => {
    return [...options, isCustomAddress(selected) ? selected : undefined].map(value => ({
      value,
      label: isCustomAddress(value) ? 'Other' : addressToString(value)
    }));
  }, [options]);

  return (
    <Picker
      options={pickerOptions}
      selected={isCustomAddress(selected) ? 'Other' : addressToString(selected)}
      onChange={onChange}
    />
  );
};
