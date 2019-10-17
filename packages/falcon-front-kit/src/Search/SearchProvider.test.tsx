import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter, Route, RouteComponentProps } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { GET_BACKEND_CONFIG } from '@deity/falcon-shop-data';
import { wait } from '../../../../test/helpers';
import { SearchProvider, SearchProviderInner } from './SearchProvider';
import { SearchContextValue } from './SearchContextValue';
import { SearchContext } from './SearchContext';
import { SearchState } from './searchState';

// custom serializing and deserializing go avoid problems when default implementation of those changes
const stateToUrl = (state: SearchState) => JSON.stringify(state);
const stateFromUrl = (url: string) => (url ? JSON.parse(url.replace('?', '')) : {});

const sortOrders = [
  {
    name: 'Price ascending',
    value: { field: 'price', direction: 'asc' }
  },
  {
    name: 'Price descending',
    value: { field: 'price', direction: 'desc' }
  }
];

const mocks = [
  {
    request: {
      query: GET_BACKEND_CONFIG
    },
    result: {
      data: {
        backendConfig: {
          locales: ['en-US'],
          activeLocale: 'en-US',
          shop: {
            activeCurrency: 'USD',
            sortOrderList: sortOrders
          }
        }
      }
    }
  }
];

describe('SearchProvider', () => {
  let wrapper: ReactWrapper<any, any> | null;
  let searchInfo: SearchContextValue;

  // mounts all the required pieces (router, route, mocked apollo and search provider) and returns wrapper with all elements
  const renderSearchProvider = async (ContentComponent: any = null) => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route>
            <SearchProvider searchStateFromURL={stateFromUrl} searchStateToURL={stateToUrl}>
              <SearchContext.Consumer>
                {search => {
                  searchInfo = search;
                  return ContentComponent ? <ContentComponent search={search} /> : null;
                }}
              </SearchContext.Consumer>
            </SearchProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    // wait for Query to be executed
    await wait(0);
  };

  const getLocation = () =>
    (wrapper!.find((SearchProvider as any).WrappedComponent).props() as RouteComponentProps).location;
  const getSearchInfo = () => wrapper!.find(SearchProviderInner as any).state();

  beforeEach(async () => {
    await act(async () => {
      await renderSearchProvider();
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  it('should provide info about search via context', async () => {
    expect(searchInfo).not.toBeUndefined();
  });

  it('setFilter() should update url and pass new filter value in props', async () => {
    searchInfo.setFilter('price', ['10']);
    wrapper!.update();
    expect(searchInfo.state.filters).toHaveLength(1);
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('setFilter() without value should update url and remove filter value from passed props', async () => {
    searchInfo.setFilter('price', ['10']);
    searchInfo.setFilter('price', []);
    wrapper!.update();
    expect(searchInfo.state.filters).toHaveLength(0);
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('setQuery() without value should update url and pass query in props', async () => {
    searchInfo.setTerm('searchQuery');
    searchInfo.setFilter('price', []);
    wrapper!.update();
    expect(searchInfo.state.term).toEqual('searchQuery');
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('setSortOrder() should update url and pass order in props', async () => {
    searchInfo.setSortOrder({ field: 'price', direction: 'asc' as any });
    wrapper!.update();
    // sortOrders property passed to SearchProvider (from Query or via prop directly)
    expect(searchInfo.state.sort).toEqual({ field: 'price', direction: 'asc' });
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('setPagination() should update url and pass pagination in props', async () => {
    searchInfo.setPagination({ page: 1, perPage: 10 });
    wrapper!.update();
    expect(searchInfo.state.pagination).toEqual({ page: 1, perPage: 10 });
    expect(getLocation().search).toEqual(`?${JSON.stringify(getSearchInfo())}`);
  });

  it('history change should trigger update of search state', async () => {
    const { history } = wrapper!.find((SearchProvider as any).WrappedComponent).props() as RouteComponentProps;
    history.push('/?{"term":"foo"}');
    wrapper!.update();
    expect(searchInfo.state.term).toEqual('foo');
  });
});
