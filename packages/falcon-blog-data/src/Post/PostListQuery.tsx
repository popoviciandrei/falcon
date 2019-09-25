import gql from 'graphql-tag';
import { PaginationQuery, Query } from '@deity/falcon-data';
import { BlogPost, BlogPostList } from '@deity/falcon-blog-extension';

const GET_BLOG_POST_LIST = gql`
  query BlogPosts($pagination: PaginationInput) {
    blogPostList(pagination: $pagination) {
      items {
        title
        date
        slug
        excerpt
        image {
          url
          description
        }
      }
      pagination {
        currentPage
        nextPage
        prevPage
        perPage
        totalPages
      }
    }
  }
`;

export type BlogPostListResponse = {
  blogPostList: Pick<BlogPostList, 'pagination'> & {
    items: Pick<BlogPost, 'title' | 'date' | 'slug' | 'excerpt' | 'image'>[];
  };
};
export type BlogPostListQueryVariables = PaginationQuery;

export class BlogPostListQuery extends Query<BlogPostListResponse, BlogPostListQueryVariables> {
  static defaultProps = {
    query: GET_BLOG_POST_LIST
  };
}
