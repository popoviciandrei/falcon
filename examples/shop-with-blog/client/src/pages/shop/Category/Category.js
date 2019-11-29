import React from 'react';
import PropTypes from 'prop-types';
import { NetworkStatus } from 'apollo-client';
import { Helmet } from 'react-helmet-async';
import { Toggle } from 'react-powerplug';
import { CategoryWithProductListQuery } from '@deity/falcon-shop-data';
import { H1, Box, FlexLayout, Divider, Button } from '@deity/falcon-ui';
import { SearchConsumer, SortOrderPickerProvider, getFiltersData } from '@deity/falcon-front-kit';
import {
  Loader,
  CategoryLayout,
  CategoryArea,
  Sidebar,
  SidebarLayout,
  Responsive,
  SortOrderPicker,
  FiltersSummary,
  ProductList
} from '@deity/falcon-ui-kit';
import { Filters } from './Filters';
import { ShowMore, ShowingOutOf } from './components';

const copy = item => item && JSON.parse(JSON.stringify(item));

const CategoryPage = ({ match: { params } }) => (
  <SearchConsumer>
    {({ state }) => (
      <CategoryWithProductListQuery
        variables={{
          categoryId: params.id,
          sort: state.sort,
          filters: copy(state.filters)
        }}
        passLoading
      >
        {({ data: { category }, fetchMore, networkStatus, loading }) => {
          if (!category && loading) {
            return <Loader />;
          }

          const { name, productList } = category;
          const { pagination, items, aggregations } = productList;
          const filtersData = getFiltersData(state.filters, aggregations);

          return (
            <CategoryLayout variant={!filtersData.length && 'noFilters'}>
              {loading && <Loader variant="overlay" />}
              <Helmet>
                <title>{name}</title>
              </Helmet>
              <Box gridArea={CategoryArea.heading}>
                <H1>{name}</H1>
                <FlexLayout justifyContent="space-between" alignItems="center">
                  <ShowingOutOf itemsCount={items.length} totalItems={pagination.totalItems} />
                  <SortOrderPickerProvider>
                    {sortOrderPickerProps => <SortOrderPicker {...sortOrderPickerProps} />}
                  </SortOrderPickerProvider>
                </FlexLayout>
                <Divider mt="xs" />
              </Box>
              {!!filtersData.length && (
                <Box gridArea={CategoryArea.filters}>
                  <Responsive width="md">
                    {matches =>
                      matches ? (
                        <Filters data={filtersData} />
                      ) : (
                        <Toggle initial={false}>
                          {({ on, toggle }) => (
                            <React.Fragment>
                              <Button onClick={toggle}>Filters</Button>
                              <Sidebar isOpen={on} side="left" close={toggle}>
                                <SidebarLayout title="Filters">
                                  <Filters data={filtersData} px="md" />
                                </SidebarLayout>
                              </Sidebar>
                            </React.Fragment>
                          )}
                        </Toggle>
                      )
                    }
                  </Responsive>
                </Box>
              )}
              <Box gridArea={CategoryArea.content}>
                <FiltersSummary data={filtersData} />
                <ProductList items={items} />
              </Box>
              <FlexLayout gridArea={CategoryArea.footer} flexDirection="column" alignItems="center">
                {pagination.nextPage && <Divider />}
                {pagination.nextPage && (
                  <ShowMore onClick={fetchMore} loading={networkStatus === NetworkStatus.fetchMore} />
                )}
              </FlexLayout>
            </CategoryLayout>
          );
        }}
      </CategoryWithProductListQuery>
    )}
  </SearchConsumer>
);

CategoryPage.propTypes = {
  match: PropTypes.any.isRequired
};

export default CategoryPage;
