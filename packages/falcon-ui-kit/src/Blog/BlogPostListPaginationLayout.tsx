import { themed, Box } from '@deity/falcon-ui';

export type BlogPostListPaginationLayoutProps = {
  isPrevPage?: boolean;
};
export const BlogPostListPaginationLayout = themed<BlogPostListPaginationLayoutProps>({
  tag: Box,
  defaultProps: {
    isPrevPage: false
  },
  defaultTheme: {
    blogPostsPaginationLayout: {
      display: 'flex',
      justifyContent: 'space-between',
      pt: 'lg',
      css: ({ isPrevPage }) => ({
        justifyContent: isPrevPage ? 'space-between' : 'flex-end'
      })
    }
  }
});
