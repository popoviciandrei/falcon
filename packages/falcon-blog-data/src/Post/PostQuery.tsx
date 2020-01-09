import gql from 'graphql-tag';
import { Query } from '@deity/falcon-data';
import { BlogPost } from '@deity/falcon-blog-extension';

const GET_BLOG_POST = gql`
  query BlogPost($path: String!) {
    blogPost(path: $path) {
      title
      date
      content
      image {
        url
        description
      }
    }
  }
`;

export type BlogPostResponse = {
  blogPost: Pick<BlogPost, 'title' | 'date' | 'content' | 'image'>;
};

export type BlogPostQueryVariables = {
  path: string;
};

export class BlogPostQuery extends Query<BlogPostResponse, BlogPostQueryVariables> {
  static defaultProps = {
    query: GET_BLOG_POST
  };
}
