import React from 'react';
import mockAxios from 'axios';
import { unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';

import {mapResponse} from '../__fixtures__/mapResponse';
import MapList from './MapList';

jest.mock('axios')

let container = null;
beforeEach(() => {
  jest.resetAllMocks();
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
    Promise.resolve({data: {results: [mapResponse]}})
  );
  const wrapper = await mount(<MapList />);
  const instance = await wrapper.instance();

  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(instance.state.arrangementMapList).toEqual([mapResponse]);
  expect(wrapper.find("ul.list-group").length).toEqual(1);
  expect(wrapper.find("ul.list-group").text()).toContain(mapResponse.title);
});

it('renders without data', async () => {
  mockAxios.get.mockImplementationOnce(() =>
    Promise.resolve({data: {results: []}})
  );
  const wrapper = await mount(<MapList />);
  const instance = await wrapper.instance();

  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(instance.state.arrangementMapList).toEqual([]);
  expect(wrapper.find("ul.list-group").text()).toEqual("No Arrangement Maps yet")
});

it('deletes map', async () => {
  mockAxios.get.mockImplementation(() =>
    Promise.resolve({data: {results: [mapResponse]}})
  );
  mockAxios.delete.mockImplementationOnce(() =>
    Promise.resolve({detail: "Map deleted"})
  );
  const wrapper = await mount(<MapList />);
  const instance = await wrapper.instance();

  act(() => {
    instance.handleDelete(mapResponse);
  })

  expect(mockAxios.delete).toHaveBeenCalledTimes(1)
});
