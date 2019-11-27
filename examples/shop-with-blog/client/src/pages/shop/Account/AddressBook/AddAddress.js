import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddAddressForm, PageLayout } from '@deity/falcon-ui-kit';
import { H1 } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';

const AddAddress = () => {
  const [done, setDone] = useState(false);
  const onDone = () => setDone(true);

  if (done) {
    return <Redirect to="/account/address-book" />;
  }

  return (
    <PageLayout>
      <H1>
        <T id="addAddress.title" />
      </H1>
      <AddAddressForm onSuccess={onDone} onCancel={onDone} />
    </PageLayout>
  );
};

export default AddAddress;
