import React from 'react';
import mockAxios from 'axios';
import { render, unmountComponentAtNode } from 'react-dom';
import { mount } from 'enzyme';

import mapResponse from '../__fixtures__/mapResponse';
import MapList from './MapList';

jest.mock('axios')

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders with data', async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({data: {results: mapResponse}})
  );
  const wrapper = await mount(<MapList />);
  const instance = await wrapper.instance();
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(instance.state.arrangementMapList).toEqual(mapResponse);
});

// Test Delete

// Test Edit
