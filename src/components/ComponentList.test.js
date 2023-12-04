import React from 'react';
import '@testing-library/jest-dom';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {mapResponse} from '../__fixtures__/mapResponse';
import ComponentList from './ComponentList';

jest.mock('axios');

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders without crashing', async () => {
  act(() => {
    render(<ComponentList
      items={mapResponse.children}
      onChange={jest.fn()} />, container);
  });
});

it('toggles component detail modal', async () => {
  await act(async () => {
    await render(<ComponentList
      items={mapResponse.children}
      onChange={jest.fn()} />, container);
  });

  const primary = document.querySelector('.btn-primary');
  expect(document.querySelector('.modal-md')).toBeNull();

  await act(async () => await primary.click());
  expect(document.querySelector('.modal-md')).toBeVisible();
});
