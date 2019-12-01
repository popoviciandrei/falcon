import React from 'react';
import { H4, DetailsContent } from '@deity/falcon-ui';
import { FilterDetails } from './FilterDetails';
import { FilterDetailsSummaryLayout } from './FilterDetailsSummaryLayout';

export type FilterTileProps = {
  title: string;
  initiallyOpen: boolean;
};

export const FilterTile: React.SFC<FilterTileProps> = ({ title, initiallyOpen, children }) => (
  <FilterDetails initiallyOpen={initiallyOpen}>
    {({ toggle }) => (
      <>
        <FilterDetailsSummaryLayout onClick={toggle}>
          <H4>{title}</H4>
        </FilterDetailsSummaryLayout>
        <DetailsContent>{children}</DetailsContent>
      </>
    )}
  </FilterDetails>
);
FilterDetails.defaultProps = {
  initiallyOpen: false
};
