import React, { useMemo } from 'react';
import { addressToString } from '@deity/falcon-front-kit';
import { Picker } from '@deity/falcon-ui-kit';

export const isAddressCustom = address => !address || (address && !address.id);

export const AddressPicker = ({ options, selected, onChange }) => {
  const pickerOptions = useMemo(() => {
    return [...options, isAddressCustom(selected) ? selected : undefined].map(value => ({
      value,
      label: isAddressCustom(value) ? 'Other' : addressToString(value)
    }));
  }, [options]);

  return (
    <Picker
      options={pickerOptions}
      selected={isAddressCustom(selected) ? 'Other' : addressToString(selected)}
      onChange={onChange}
    />
  );
};
