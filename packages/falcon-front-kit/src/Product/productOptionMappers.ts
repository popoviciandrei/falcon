import { ProductOption, ProductOptionInput } from '@deity/falcon-shop-extension';

export type ProductOptionsMap = {
  [attributeId: string]: any;
};

export const productOptionsToForm = (options: Pick<ProductOption, 'attributeId'>[]): ProductOptionsMap =>
  options.map(x => x.attributeId).reduce((prev, x) => ({ ...prev, [x]: undefined }), {});

export const formProductOptionsToInput = (options: ProductOptionsMap) =>
  Object.entries(options).map<ProductOptionInput>(item => ({
    id: parseInt(item[0], 10),
    value: parseInt(item[1], 10)
  }));
