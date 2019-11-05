import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deity/falcon-ui';
import { AddressDetailsLayout } from './AddressDetailsLayout';

export type AddressDetailsProps = {
  company?: string;
  firstname: string;
  lastname: string;
  street: string[];
  postcode?: string;
  city: string;
  country: {
    code: string;
    englishName?: string;
  };
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
    <Text>{`${postcode} ${city}, ${country.englishName || country.code}`}</Text>
    {telephone && <Text>{telephone}</Text>}
  </AddressDetailsLayout>
);
AddressDetails.propTypes = {
  company: PropTypes.string,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  street: PropTypes.arrayOf(PropTypes.string).isRequired,
  postcode: PropTypes.string, // TODO: check why it is optional ?
  city: PropTypes.string.isRequired,
  // @ts-ignore
  country: PropTypes.shape({
    code: PropTypes.string.isRequired,
    englishName: PropTypes.string
  }).isRequired,
  telephone: PropTypes.string
};
