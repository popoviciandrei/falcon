import React from 'react';
import {
  themed,
  Dropdown,
  DropdownLabel,
  DropdownMenu,
  DropdownMenuItem,
  ThemedComponentProps
} from '@deity/falcon-ui';

export type PickerItem<TValue = any> = {
  label: string;
  value?: TValue;
};

export type PickerProps<TItem extends PickerItem = PickerItem> = ThemedComponentProps & {
  options: TItem[];
  selected: string | TItem;
  onChange?: (x: TItem['value']) => any;
};

export const PickerInnerDOM: React.SFC<PickerProps> = ({ options, selected, ...rest }) => (
  <Dropdown {...rest}>
    <DropdownLabel>{selected && typeof selected === 'object' ? selected.label : selected}</DropdownLabel>
    <DropdownMenu>
      {options.map(x => (
        <DropdownMenuItem key={x.label} value={x.value}>
          {x.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  </Dropdown>
);

export const Picker = themed<PickerProps>({
  tag: PickerInnerDOM,
  defaultTheme: {
    picker: {}
  }
});
