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
  const instance = await wrapper.instance();
  expect(instance.state.activeMap).toEqual({"title": "", });
  expect(instance.state.editable).toBe(true)
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
  expect(instance.state.editable).toBe(false)
  expect(instance.state.activeMap.publish).toBe(false)
});

it('toggles editable', async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({data: mapResponse})
  );
  const params = {
    params: {id: 1}
  }
  const wrapper = await mount(<MapForm match={params}/>);
  const instance = await wrapper.instance();
  instance.toggleEditable()
  expect(instance.state.editable).toBe(true)
});

it('handles publish correctly', async () => {
  mockAxios.get.mockImplementation(() =>
    Promise.resolve({data: mapResponse})
  );
  mockAxios.put.mockImplementationOnce(() =>
    Promise.resolve({mapResponse})
  );
  const params = {
    params: {id: 1}
  }
  const wrapper = await mount(<MapForm match={params}/>);
  const instance = await wrapper.instance();

  // Toggle publish modal
  instance.toggleModal(instance.state.activeMap)
  expect(instance.state.publishModal).toBe(true)

  // Publish current map
  instance.togglePublish(instance.state.activeMap)
  expect(instance.state.publishModal).toBe(false)
  expect(instance.state.activeMap.publish).toBe(true)
});
