import { themed, Box } from '@deity/falcon-ui';
import { toGridTemplate } from '../helpers';

export const CategoryArea = {
  heading: 'heading',
  filters: 'filters',
  content: 'content',
  footer: 'footer'
};

export const CategoryLayout = themed({
  tag: Box,

  defaultTheme: {
    categoryLayout: {
      display: 'grid',
      gridGap: 'md',
      my: 'lg',
      // prettier-ignore
      gridTemplate: {
        xs: toGridTemplate([
          ['1fr'               ],
          [CategoryArea.heading],
          [CategoryArea.filters],
          [CategoryArea.content],
          [CategoryArea.footer ]
        ]),
        md: toGridTemplate([
          ['1fr',                   '3fr'               ],
          [CategoryArea.heading,    CategoryArea.heading],
          [CategoryArea.filters,    CategoryArea.content],
          [CategoryArea.footer,     CategoryArea.footer ]
        ]),
        lg: toGridTemplate([
          ['1fr',                   '4fr'               ],
          [CategoryArea.heading,    CategoryArea.heading],
          [CategoryArea.filters,    CategoryArea.content],
          [CategoryArea.footer,     CategoryArea.footer ]
        ])
      },
      css: {
        position: 'relative'
      },

      variants: {
        noFilters: {
          // prettier-ignore
          gridTemplate: toGridTemplate([
              ['1fr'],
              [CategoryArea.heading],
              [CategoryArea.content],
              [CategoryArea.footer]
            ])
        }
      }
    }
  }
});
