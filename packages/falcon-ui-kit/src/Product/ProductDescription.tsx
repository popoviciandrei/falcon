import { themed } from '@deity/falcon-ui';
import { InnerHTML, InnerHtmlProps } from '../InnerHtml';

export type ProductDescriptionProps = InnerHtmlProps;

export const ProductDescription = themed<ProductDescriptionProps, any>({
  tag: InnerHTML,
  defaultTheme: {
    productDescription: {
      css: {
        p: {
          margin: 0
        }
      }
    }
  }
});
