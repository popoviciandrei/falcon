import { SortOrderDirection } from '@deity/falcon-data';
import { FilterOperator } from '@deity/falcon-shop-extension';
import { searchStateFromURL, searchStateToURL } from './searchState';

describe('Search State', () => {
  it('should correctly serializing and deserializing search filters', () => {
    const input = {
      filters: [
        {
          field: 'price',
          operator: FilterOperator.equals,
          value: ['10']
        }
      ]
    };

    expect(searchStateFromURL(searchStateToURL(input))).toEqual(input);
  });

  it('should correctly serializing and deserializing pagination', () => {
    const input = {
      pagination: {
        perPage: 10,
        page: 2
      }
    };

    expect(searchStateFromURL(searchStateToURL(input))).toEqual(input);
  });

  it('should correctly serializing and deserializing sort orders', () => {
    const input = {
      sort: {
        field: 'price',
        direction: 'desc' as SortOrderDirection
      }
    };

    expect(searchStateFromURL(searchStateToURL(input))).toEqual(input);
  });

  it('should correctly serializing and deserializing search query', () => {
    const input = {
      term: 'foo'
    };

    expect(searchStateFromURL(searchStateToURL(input))).toEqual(input);
  });
});
