import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Switch } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { GET_URL } from '@deity/falcon-data';
import { wait } from '../../../../test/helpers';
import { DynamicRoute } from './DynamicRoute';

describe('DynamicRoute', () => {
  it('Should render DynamicRoute content', async () => {
    const mocks = [
      {
        request: {
          query: GET_URL,
          variables: { path: '/test' }
        },
        result: {
          data: {
            url: {
              __typename: 'ResourceMeta',
              id: 100,
              type: 'foo',
              path: '/test',
              redirect: false
            }
          }
        }
      }
    ];

    const Loader = () => <span>Loading...</span>;
    const Foo = () => <p>foo</p>;

    const App = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/test']}>
          <Switch>
            <DynamicRoute loaderComponent={Loader} notFound={() => <span>Not found</span>} components={{ foo: Foo }} />
          </Switch>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(App.find(DynamicRoute).length).toBe(1);
    expect(App.find(DynamicRoute).find(Loader)).toBeTruthy();

    await wait(100);

    expect(App.find(DynamicRoute).length).toBe(1);
    expect(App.find(DynamicRoute).find(Foo)).toBeTruthy();
  });
});
