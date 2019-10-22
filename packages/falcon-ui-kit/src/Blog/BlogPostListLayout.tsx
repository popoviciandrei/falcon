import { themed, List } from '@deity/falcon-ui';

export const BlogPostListLayout = themed({
  tag: List,
  defaultTheme: {
    blogPostListLayout: {
      display: 'grid',
      gridGap: 'xl',
      gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(6, 1fr)'
      },
      p: 'none',
      css: {
        listStyle: 'none'
      }
    }
  }
});
