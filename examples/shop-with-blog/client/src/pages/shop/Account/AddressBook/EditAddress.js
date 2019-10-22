import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { H1 } from '@deity/falcon-ui';
import { PageLayout, EditAddressForm } from '@deity/falcon-ui-kit';

const EditAddress = ({ match }) => {
  const id = parseInt(match.params.id, 10);

  const [done, setDone] = useState(false);
  const onDone = () => setDone(true);

  if (done) {
    return <Redirect to="/account/address-book" />;
  }

  return (
    <PageLayout>
      <H1>
        <T id="editAddress.title" />
      </H1>
      <EditAddressForm id={id} onSuccess={onDone} onCancel={onDone} />
    </PageLayout>
  );
};

export default EditAddress;
