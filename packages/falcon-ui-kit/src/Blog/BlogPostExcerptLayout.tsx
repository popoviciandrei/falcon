import { themed, Link } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const BlogPostExcerptArea = {
  image: 'image',
  title: 'title',
  date: 'date',
  excerpt: 'excerpt',
  readMore: 'readMore'
};

export type BlogPostExcerptLayoutProps = Parameters<typeof BlogPostExcerptLayout>[0];
export const BlogPostExcerptLayout = themed({
  tag: Link,
  defaultTheme: {
    blogPostExcerptLayout: {
      display: 'grid',
      gridRowGap: 'xs',
      gridColumnGap: 'lg',
      color: 'black',
      gridTemplate: {
        xs: toGridTemplate([
          ['1fr'],
          [BlogPostExcerptArea.image],
          [BlogPostExcerptArea.date],
          [BlogPostExcerptArea.title],
          [BlogPostExcerptArea.excerpt],
          [BlogPostExcerptArea.readMore]
        ])
      },
      css: {
        textDecoration: 'none'
      }
    }
  }
});
