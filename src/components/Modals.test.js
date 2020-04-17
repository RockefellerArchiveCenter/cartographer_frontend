import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';
import {Modal} from 'reactstrap';

import {mapComponent} from '../__fixtures__/mapResponse';
import {MapComponentModal, ConfirmModal} from './Modals';

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

it('renders with ArchivesSpace resource', () => {
    render(
      <MapComponentModal activeComponent={mapComponent} />, container
    );
});

it('renders without ArchivesSpace resource', () => {
    const component = {
        title: "",
        archivesspace_uri: "",
        level: ""
    }
    render(
        <MapComponentModal activeComponent={component} />, container
    );
});

it('clears ComponentDetailModal', () => {
    const wrapper = mount(<MapComponentModal
                            activeComponent={mapComponent} />,
                            container);
    const instance = wrapper.instance();

    expect(instance.state.activeComponent).toEqual(mapComponent)

    act(() => {
      instance.toggleData({})
    })
    expect(instance.state.activeComponent).toEqual({ title: "", archivesspace_uri: "", level: ""})
});

it('renders props correctly', () => {
    const component = {
        id: 5,
        title: "Asian Cultural Council records, Grants, RG 5",
        map: 1,
        parent: null,
        tree_index: 4,
        archivesspace_uri: "/repositories/2/resources/626"
    }
    const wrapper = mount(<ConfirmModal
      title="Confirm delete"
      activeItem={component}
      message={`Are you sure you want to delete ${component.title}?`}
      confirmButtonText="Yes, delete it"
      cancelButtonText="Nope, cancel"
    />, container);

    expect(wrapper.props("children").title).toBe("Confirm delete")
    expect(wrapper.props("children").activeItem).toBe(component)
    expect(wrapper.props("children").message).toBe(`Are you sure you want to delete ${component.title}?`)
    expect(wrapper.props("children").confirmButtonText).toBe("Yes, delete it")
    expect(wrapper.props("children").cancelButtonText).toBe("Nope, cancel")
});
