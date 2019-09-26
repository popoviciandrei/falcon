import React from 'react';
import { Text, Box, Dropdown, DropdownLabel, DropdownMenu, DropdownMenuItem } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { SortOrder } from '@deity/falcon-data';
import { SortOrderPickerLayout } from './SortOrderPickerLayout';

export type SortOrderPickerProps<TItem extends { name: string } = SortOrder> = {
  items: TItem[];
  value: TItem;
  onChange: (value: TItem) => void;
};
export const SortOrderPicker: React.SFC<SortOrderPickerProps> = ({ items, value, onChange }) => (
  <SortOrderPickerLayout>
    <Text mr="sm">
      <T id="productList.sort.title" />
    </Text>
    <Box display="flex">
      <Dropdown css={{ width: '100%', minWidth: 200 }} onChange={onChange}>
        <DropdownLabel>{value.name}</DropdownLabel>
        <DropdownMenu>
          {items.map((x: any) => (
            <DropdownMenuItem key={x.name} value={x}>
              {x.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </Box>
  </SortOrderPickerLayout>
);
