import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { SEO as SEOType } from '@deity/falcon-shop-extension';

export type SeoProps = {
  data: Partial<SEOType>;
};

export const SEO: React.FC<SeoProps> = ({ data: { title, description, keywords } }) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
  </Helmet>
);

SEO.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string
  })
};
