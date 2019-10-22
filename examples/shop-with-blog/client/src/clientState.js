import { getClientConfigResolver } from '@deity/falcon-front-kit';
import { openSidebarResolver, closeSidebarResolver } from 'src/components';

/**
 * Defines client-side state resolvers
 */

export default {
  data: {
    sidebar: {
      contentType: null,
      side: 'right',
      isOpen: false,
      __typename: 'SidebarStatus'
    }
  },

  resolvers: {
    Query: {
      clientConfig: getClientConfigResolver
    },

    Mutation: {
      openSidebar: openSidebarResolver,
      closeSidebar: closeSidebarResolver
    }
  }
};
