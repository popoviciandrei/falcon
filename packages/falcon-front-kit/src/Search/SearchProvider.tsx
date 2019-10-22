import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Location } from 'history';
import { SortOrderValue, PaginationInput } from '@deity/falcon-data';
import { BackendConfigQuery } from '@deity/falcon-shop-data';
import { FilterOperator } from '@deity/falcon-shop-extension';
import { areSortOrderInputsEqual } from '../SortOrder/areSortOrderInputsEqual';
import { SearchContext } from './SearchContext';
import { SearchState, searchStateFromURL, searchStateToURL } from './searchState';

type SearchProviderInnerProps = SearchProviderProps &
  RouteComponentProps & {
    sortOrders: (SortOrderValue | undefined)[];
    defaultSortOrder?: SortOrderValue;
  };
export class SearchProviderInner extends React.Component<SearchProviderInnerProps, SearchState> {
  static defaultProps = {
    searchStateFromURL,
    searchStateToURL,
    filters: []
  };

  constructor(props: SearchProviderInnerProps) {
    super(props);

    this.state = this.getStateFromURL(props.location);
  }

  componentDidMount() {
    this.historyUnlisten = this.props.history.listen(this.restoreStateFromURL);
  }

  componentWillUnmount() {
    this.historyUnlisten();
  }

  get defaultSortOrder(): SortOrderValue | undefined {
    const { defaultSortOrder, sortOrders } = this.props;
    if (defaultSortOrder) {
      return defaultSortOrder;
    }
    if (sortOrders.some(x => !x)) {
      return undefined;
    }

    return sortOrders[0];
  }

  getStateFromURL(location: Location): SearchState {
    const { sort, filters, ...rest } = this.props.searchStateFromURL!(location.search);

    return {
      ...rest,
      filters: Array.isArray(filters) ? filters : [],
      sort: sort && this.sortOrderExists(sort) ? sort : undefined
    };
  }

  setFilter = (field: string, value: string[], operator = FilterOperator.equals) => {
    let filters = [...this.state.filters];

    if (value.length === 0) {
      filters = filters.filter(x => x.field !== field);
    } else {
      const filterIndex = filters.findIndex(x => x.field === field);
      if (filterIndex >= 0) {
        filters[filterIndex] = { ...filters[filterIndex], value, operator };
      } else {
        filters.push({ field, value, operator });
      }
    }

    this.updateURL({ ...this.state, filters });
  };

  setSortOrder = (sort?: SortOrderValue) => {
    this.updateURL({ ...this.state, sort: this.sortOrderExists(sort) ? sort : this.defaultSortOrder });
  };

  setPagination = (pagination: PaginationInput) => this.updateURL({ ...this.state, pagination });

  setTerm = (term: string) => this.updateURL({ ...this.state, term });

  sortOrderExists = (sort?: SortOrderValue): boolean =>
    this.props.sortOrders.some(x => (!x && !sort) || areSortOrderInputsEqual(x, sort));

  removeFilters = () => this.updateURL({ ...this.state, filters: [] });

  stateToSerialize = (state: SearchState): Partial<SearchState> => {
    const stateToSerialize: Partial<SearchState> = { ...state };

    return stateToSerialize;
  };

  private restoreStateFromURL = (location: any) => {
    const state = this.getStateFromURL(location);
    // state created from URL might be empty so we have to make sure that all the items are correctly
    // removed from current state - setting undefined for non existing value will do the trick
    Object.keys(this.state).forEach(key => {
      if (!(key in state)) {
        state[key as keyof SearchState] = undefined;
      }
    });

    this.setState(state);
  };

  private historyUnlisten = () => {};

  private updateURL(state: SearchState) {
    const queryString = this.props.searchStateToURL!(state);
    this.props.history.push(`${this.props.location.pathname}?${queryString}`);
  }

  render() {
    return (
      <SearchContext.Provider
        value={{
          state: { ...this.state },
          setFilter: this.setFilter,
          removeFilter: x => this.setFilter(x, []),
          removeFilters: this.removeFilters,
          setSortOrder: this.setSortOrder,
          setPagination: this.setPagination,
          setTerm: this.setTerm
        }}
      >
        {this.props.children}
      </SearchContext.Provider>
    );
  }
}

export type SearchProviderProps = {
  searchStateFromURL?(url: string): Partial<SearchState>;
  searchStateToURL?(state: Partial<SearchState>): string;
};
const SearchProviderWithSortOrders: React.SFC<SearchProviderProps & RouteComponentProps> = ({ ...rest }) => (
  <BackendConfigQuery>
    {({ data: { backendConfig } }) => (
      <SearchProviderInner {...rest} sortOrders={backendConfig.shop.sortOrderList.map(x => x.value)} />
    )}
  </BackendConfigQuery>
);

// wrap everything in router so SearchProviderWithSortOrders has access to history and location
export const SearchProvider = withRouter(SearchProviderWithSortOrders);
