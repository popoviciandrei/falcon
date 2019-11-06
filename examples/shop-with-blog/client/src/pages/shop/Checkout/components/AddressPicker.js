import React from 'react';
import { addressToString } from '@deity/falcon-front-kit';
import { Picker } from '@deity/falcon-ui-kit';

export const AddressPicker = ({ options, selected, onChange }) => {
  const noSelectionOption = { value: 'Other', label: 'Other' };

  return (
    <Picker
      options={[...options.map(value => ({ value, label: addressToString(value) })), noSelectionOption]}
      selected={typeof selected === 'object' ? addressToString(selected) : selected}
      onChange={value => onChange(value)}
    />
  );
};
