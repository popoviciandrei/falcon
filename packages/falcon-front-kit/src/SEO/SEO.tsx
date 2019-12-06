import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { SEO as SEOType } from '@deity/falcon-shop-extension';

export type SeoProps = {
  meta: Partial<SEOType>;
  title: string;
};

export const SEO: React.FC<SeoProps> = ({ meta: { title: metaTitle, description, keywords }, title }) => (
  <Helmet>
    <title>{metaTitle || title}</title>
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
  </Helmet>
);

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string
  })
};

SEO.defaultProps = {
  meta: {}
};
