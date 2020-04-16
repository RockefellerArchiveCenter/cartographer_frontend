import React from 'react';
import { findDOMNode, render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { mount } from 'enzyme';
import {Modal} from 'reactstrap';

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
  act(() => {
    const component = {
        id: 5,
        title: "Asian Cultural Council records, Grants, RG 5",
        map: 1,
        parent: null,
        tree_index: 4,
        archivesspace_uri: "/repositories/2/resources/626"
    }
    render(
      <MapComponentModal
        activeComponent={component}
      />, container);
  });
});

it('renders without ArchivesSpace resource', () => {
  act(() => {
    const component = {
        title: "",
        archivesspace_uri: "",
        level: ""
    }
    render(<MapComponentModal
            activeComponent={component}
          />, container);
  });
});

// clear ComponentDetailModal

// cancel and submit (need to mock functions)

it('renders props correctly', () => {
  act(() => {
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
    console.log(wrapper.props("children"))
    expect(wrapper.props("children").title).toBe("Confirm delete")
    expect(wrapper.props("children").activeItem).toBe(component)
    expect(wrapper.props("children").message).toBe(`Are you sure you want to delete ${component.title}?`)
    expect(wrapper.props("children").confirmButtonText).toBe("Yes, delete it")
    expect(wrapper.props("children").cancelButtonText).toBe("Nope, cancel")
  })
})

// call confirm and cancel (will need to mock)
