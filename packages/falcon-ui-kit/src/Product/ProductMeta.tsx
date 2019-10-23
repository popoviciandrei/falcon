import React from 'react';
import { Details, Summary, DetailsContent } from '@deity/falcon-ui';

export type MetaItem = {
  name: string;
  content: string;
};
export type ProductMetaProps = {
  meta: MetaItem[];
  onChange?: Function;
  activeItem?: MetaItem;
};
export const ProductMeta: React.SFC<ProductMetaProps> = ({ meta, onChange, activeItem }) => (
  <React.Fragment>
    {meta.map(item => (
      <Details key={item.name} open={activeItem && activeItem === item}>
        <Summary variant="secondary" onClick={() => onChange && onChange(item)}>
          {item.name}
        </Summary>
        <DetailsContent>{item.content}</DetailsContent>
      </Details>
    ))}
  </React.Fragment>
);
