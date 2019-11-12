import React, { useMemo, useState } from 'react';
import { addressToString } from '@deity/falcon-front-kit';
import { Picker } from '@deity/falcon-ui-kit';

export const isAddressCustom = address => !address || (address && !address.id);

export const AddressPicker = ({ options, selected, onChange }) => {
  const [customAddress] = useState(isAddressCustom(selected) ? selected : undefined);

  const pickerOptions = useMemo(() => {
    return [...options, customAddress].map(value => ({
      value,
      label: isAddressCustom(value) ? 'Other' : addressToString(value)
    }));
  }, [options, customAddress]);

  return (
    <Picker
      options={pickerOptions}
      selected={isAddressCustom(selected) ? 'Other' : addressToString(selected)}
      onChange={onChange}
    />
  );
};
