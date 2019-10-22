import { GET_SIDEBAR_STATE } from './SidebarQuery';

export const closeSidebarResolver = (_, _variables, { cache }) => {
  const queryResponse = cache.readQuery({ query: GET_SIDEBAR_STATE });
  const sidebar = { ...queryResponse.sidebar };
  sidebar.isOpen = false;

  cache.writeQuery({
    query: GET_SIDEBAR_STATE,
    data: { sidebar }
  });

  return null;
};
