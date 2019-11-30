import React from 'react';
import { isNetworkError } from '@deity/falcon-data';
import { T } from '@deity/falcon-i18n';
import { H2, Link } from '@deity/falcon-ui';
import { PageLayout, FixCenteredLayout } from '@deity/falcon-ui-kit';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  /** @param {Error} error */
  getMessageId(error) {
    if (isNetworkError(error)) {
      const { networkError } = error;
      const code = (networkError.result && networkError.result.code) || 'UNKNOWN';

      if (code === 'ECONNREFUSED' || networkError.message === 'Failed to fetch') {
        return 'failedToFetch';
      }
    }

    return 'unknown';
  }

  /** @param {Error} error */
  errorInsights(error) {
    if (process.env.NODE_ENV !== 'production') {
      return JSON.stringify(error, null, 2);
    }

    return '';
  }

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <PageLayout>
        <FixCenteredLayout maxWidth={700} css={{ textAlign: 'center' }}>
          <H2 mb="md" title={this.errorInsights(error)}>
            <T id={`error.${this.getMessageId(error)}`} />
          </H2>
          <Link onClick={() => window.location.reload()}>Refresh</Link>
        </FixCenteredLayout>
      </PageLayout>
    );
  }
}
