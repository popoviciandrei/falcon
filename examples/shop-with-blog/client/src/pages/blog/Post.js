import React from 'react';
import { T } from '@deity/falcon-i18n';
import { BlogPostQuery } from '@deity/falcon-blog-data';
import { H1, Breadcrumbs, Breadcrumb } from '@deity/falcon-ui';
import { BlogPostLayout, FormattedDate, CMSContent, PageLayout, BreadcrumbLink } from '@deity/falcon-ui-kit';

const Post = ({ path }) => (
  <PageLayout>
    <BlogPostQuery variables={{ path }}>
      {({ data: { blogPost } }) => (
        <React.Fragment>
          <Breadcrumbs alignSelf="flex-start">
            <BreadcrumbLink to="/">
              <T id="name" />
            </BreadcrumbLink>
            <BreadcrumbLink to="/blog">
              <T id="blog.title" />
            </BreadcrumbLink>
            <Breadcrumb>{blogPost.title}</Breadcrumb>
          </Breadcrumbs>

          <BlogPostLayout>
            <H1>{blogPost.title}</H1>
            <FormattedDate mb="xl" value={blogPost.date} />
            <CMSContent html={blogPost.content} />
          </BlogPostLayout>
        </React.Fragment>
      )}
    </BlogPostQuery>
  </PageLayout>
);

export default Post;
