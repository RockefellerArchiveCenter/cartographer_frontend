import React from 'react';
import mockAxios from 'axios';
import { unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';

import {mapResponse, mapComponent } from '../__fixtures__/mapResponse';
import ComponentList from './ComponentList';

jest.mock('axios')

let container = null;
beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders without crashing', () => {
  const wrapper = mount(
      <ComponentList
        activeMap={mapResponse}
        items={mapResponse.children}
        onChange={function(){}} />);
  const instance = wrapper.instance();

  expect(instance.props.activeMap).toBe(mapResponse);
});

it('toggles component detail modal', () => {
  const wrapper = mount(
      <ComponentList
        activeMap={mapResponse}
        items={mapResponse.children}
        onChange={function(){}} />);
  const instance = wrapper.instance();
  expect(instance.state.detailModal).toBe(false)

  act(() => {
    instance.toggleDetailModal({"node": mapComponent});
  })
  expect(instance.state.detailModal).toBe(true)

  act(() => {
    instance.toggleDetailModal({"node": mapComponent});
  })
  expect(instance.state.detailModal).toBe(false)
});

it('toggles confirm modal', () => {
  const wrapper = mount(
      <ComponentList
        activeMap={mapResponse}
        items={mapResponse.children}
        onChange={function(){}} />);
  const instance = wrapper.instance();
  expect(instance.state.confirmModal).toBe(false)

  act(() => {
    instance.toggleConfirmModal({"node": mapComponent});
  })
  expect(instance.state.confirmModal).toBe(true)

  act(() => {
    instance.toggleConfirmModal({"node": mapComponent});
  })
  expect(instance.state.confirmModal).toBe(false)
});

it('adds sibling node', () => {
  const {mapResponse, mapComponent} = require('../__fixtures__/mapResponse');
  const wrapper = mount(
      <ComponentList
        activeMap={mapResponse}
        items={mapResponse.children}
        onChange={function(){}} />);
  const instance = wrapper.instance();

  mapComponent.id = null
  const expected = mapResponse.children
  expected.unshift(mapComponent)

  const spy = jest.spyOn(instance, "nodeAddNew")

  act(() => {
    instance.handleNodeAction(mapComponent, [0])
  })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(instance.props.items).toEqual(expected)
});

it('adds child node', () => {
  const {mapResponse, mapComponent} = require('../__fixtures__/mapResponse');
  const wrapper = mount(
      <ComponentList
        activeMap={mapResponse}
        items={mapResponse.children}
        onChange={function(){}} />);
  const instance = wrapper.instance();

  mapComponent.id = null
  mapComponent.parent = 1
  const expected = mapResponse.children
  expected[0].children = [mapComponent]

  const spy = jest.spyOn(instance, "nodeAddChild")

  act(() => {
    instance.handleNodeAction(mapComponent, [0,1])
  })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(instance.props.items).toEqual(expected)
});

it('updates node', () => {
  const {mapResponse, mapComponent} = require('../__fixtures__/mapResponse');
  const wrapper = mount(
      <ComponentList
        activeMap={mapResponse}
        items={mapResponse.children}
        onChange={function(){}} />);
  const instance = wrapper.instance();

  const expected = mapResponse.children
  expected[0] = mapComponent

  const spy = jest.spyOn(instance, "nodeUpdate")

  act(() => {
    instance.handleNodeAction(mapComponent, [1])
  })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(instance.props.items).toEqual(expected)
});

it('deletes node', () => {
  mockAxios.delete.mockImplementationOnce(() =>
    Promise.resolve({"detail": "Component deleted."})
  );
  const {mapResponse, mapComponent} = require('../__fixtures__/mapResponse');
  const wrapper = mount(
      <ComponentList
        activeMap={mapResponse}
        items={mapResponse.children}
        onChange={function(){}} />);
  const instance = wrapper.instance();

  const spy = jest.spyOn(instance, "nodeDelete")

  act(() => {
    instance.nodeDelete({"node": mapComponent, "path": [1]})
  })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(mockAxios.delete).toHaveBeenCalledTimes(1)
});
