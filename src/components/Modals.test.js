import React from 'react';
import { findDOMNode, render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";

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

it('renders with or without ArchivesSpace resource', () => {
  act(() => {
    const component = {
        id: 5,
        title: "Asian Cultural Council records, Grants, RG 5",
        map: 1,
        parent: null,
        tree_index: 4,
        archivesspace_uri: null
    }
    render(<MapComponentModal
            activeComponent={component}
          />, container);
    });

  act(() => {
    const component = {
        id: 5,
        title: "Asian Cultural Council records, Grants, RG 5",
        map: 1,
        parent: null,
        tree_index: 4,
        archivesspace_uri: "/repositories/2/resources/626"
    }
    render(<MapComponentModal
            activeComponent={component}
          />, container);
  });
});

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
    render(<ConfirmModal
      title="Confirm delete"
      activeItem={component}
      message={`Are you sure you want to delete ${component.title}?`}
      confirmButtonText="Yes, delete it"
      cancelButtonText="Nope, cancel"
    />, container);
  })
})
