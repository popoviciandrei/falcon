import React from 'react';
import PropTypes from 'prop-types';
import { Box, H2, Button, Summary, Icon } from '@deity/falcon-ui';
import { CheckoutSectionHeaderLayout, CheckoutSectionHeaderLayoutArea } from './CheckoutSectionHeaderLayout';

export const CheckoutSectionHeader = ({ title, complete, open, summary, editLabel, onActionClick }) => (
  <Summary onClick={e => e.preventDefault()} defaultTheme={CheckoutSectionHeaderLayout}>
    {(complete || open) && (
      <Icon size="lg" gridArea={CheckoutSectionHeaderLayoutArea.icon} src={complete ? 'check' : 'arrowRight'} />
    )}
    <H2 fontSize="lg" gridArea={CheckoutSectionHeaderLayoutArea.title}>
      {title}
    </H2>
    {summary && (
      <Box pt="xs" gridArea={CheckoutSectionHeaderLayoutArea.summary}>
        {summary}
      </Box>
    )}
    {complete && (
      <Box gridArea={CheckoutSectionHeaderLayoutArea.action}>
        <Button fontSize="xs" onClick={() => onActionClick()}>
          {editLabel}
        </Button>
      </Box>
    )}
  </Summary>
);
CheckoutSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  complete: PropTypes.bool,
  open: PropTypes.bool,
  summary: PropTypes.shape({}),
  editLabel: PropTypes.string,
  onActionClick: PropTypes.func
};
