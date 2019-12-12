import React from 'react';
import mockAxios from 'axios';
import { render, unmountComponentAtNode } from 'react-dom';
import { mount } from 'enzyme';

import mapResponse from '../__fixtures__/mapResponse';
import ComponentList from './ComponentList';

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

it('renders without crashing', async () => {
  const wrapper = await mount(<ComponentList activeMap={mapResponse} items={mapResponse.children} onChange={function(){}} />);
  const instance = await wrapper.instance();
});
