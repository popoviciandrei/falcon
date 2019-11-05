import React from 'react';
import { Text } from '@deity/falcon-ui';
import { Country } from '@deity/falcon-shop-extension';
import { AddressDetailsLayout } from './AddressDetailsLayout';

export type AddressDetailsProps = {
  company?: string;
  firstname: string;
  lastname: string;
  street: string[];
  postcode?: string;
  city: string;
  country: Country;
  telephone?: string;
};

export const AddressDetails: React.SFC<AddressDetailsProps> = ({
  company,
  firstname,
  lastname,
  street,
  postcode,
  city,
  country,
  telephone
}) => (
  <AddressDetailsLayout>
    {company && <Text fontWeight="bold" color="secondaryText">{`${company}`}</Text>}
    <Text fontWeight="bold" color="secondaryText" mb="xs">{`${firstname} ${lastname}`}</Text>
    {street.map((x, i) => (
      // because `street` can contain non unique values
      // eslint-disable-next-line react/no-array-index-key
      <Text key={i}>{x}</Text>
    ))}
    <Text>{`${postcode} ${city}, ${country.code}`}</Text>
    {telephone && <Text>{telephone}</Text>}
  </AddressDetailsLayout>
);
