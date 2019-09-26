import { GET_SIDEBAR_STATE } from './SidebarQuery';

export const openSidebarResolver = (_, { contentType, side }, { cache }) => {
  const data = {
    sidebar: {
      contentType,
      side: side || 'right',
      isOpen: true,
      __typename: 'SidebarStatus'
    }
  };

  cache.writeQuery({ query: GET_SIDEBAR_STATE, data });

  return null;
};
