import React from 'react';
import mockAxios from 'axios';
import { render, unmountComponentAtNode } from 'react-dom';
import { mount } from 'enzyme';

import mapResponse from '../__fixtures__/mapResponse';
import MapForm from './MapForm';

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

it('renders without match', async () => {
  const params = {
    params: {id: null}
  }
  const wrapper = await mount(<MapForm match={params}/>);
});

it('renders with match', async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({data: mapResponse})
  );
  const params = {
    params: {id: 1}
  }
  const wrapper = await mount(<MapForm match={params}/>);
  const instance = await wrapper.instance();
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(instance.state.activeMap).toEqual(mapResponse);
});
