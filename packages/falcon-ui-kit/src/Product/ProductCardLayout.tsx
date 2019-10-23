import { Link } from 'react-router-dom';
import { themed } from '@deity/falcon-ui';

export const ProductCardLayout = themed({
  tag: Link,
  defaultTheme: {
    productCardLayout: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'secondaryText',

      css: {
        height: '100%',
        textDecoration: 'none',
        overflow: 'hidden',
        cursor: 'pointer'
      }
    }
  }
});
