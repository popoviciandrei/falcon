import React from 'react';
import { GET_CATEGORY_WITH_PRODUCT_LIST } from '@deity/falcon-shop-data';
import { useQuery } from '@deity/falcon-data';
import { ProductList, Loader, OperationError } from '@deity/falcon-ui-kit';

export const HomeProducts = () => {
  const { data, loading, error } = useQuery(GET_CATEGORY_WITH_PRODUCT_LIST, {
    variables: {
      categoryId: '25',
      query: {
        perPage: 1,
        page: 20
      }
    }
  });

  if (error) {
    return <OperationError {...error} />;
  }

  if (loading) {
    return <Loader />;
  }

  return <ProductList items={data.category.productList.items} />;
};
