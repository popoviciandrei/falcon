import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { H3, Text, Image } from '@deity/falcon-ui';
import { FormattedDate } from '../FormattedDate';
import { BlogPostExcerptLayout, BlogPostExcerptArea } from './BlogPostExcerptLayout';

export type BlogPostExcerptProps = {
  title: string;
  slug: string;
  date: string | Date;
  excerpt: string;
  image?: {
    url: string;
    description: string;
  };
};
export const BlogPostExcerpt: React.SFC<BlogPostExcerptProps> = props => {
  const { title, slug, date, image, excerpt, ...rest } = props;

  return (
    <BlogPostExcerptLayout as={RouterLink} to={slug} {...rest}>
      {image && (
        <Image css={{ height: 300 }} gridArea={BlogPostExcerptArea.image} src={image.url} alt={image.description} />
      )}
      <H3 gridArea={BlogPostExcerptArea.title}>{title}</H3>
      <FormattedDate gridArea={BlogPostExcerptArea.date} value={date} />
      <Text gridArea={BlogPostExcerptArea.excerpt}>{excerpt}</Text>
      <Text gridArea={BlogPostExcerptArea.readMore} css={{ textDecoration: 'underline' }}>
        <T id="blog.readMore" />
      </Text>
    </BlogPostExcerptLayout>
  );
};
BlogPostExcerpt.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  excerpt: PropTypes.string.isRequired,
  // @ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34692
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  })
};
