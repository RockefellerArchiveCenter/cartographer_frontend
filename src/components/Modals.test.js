import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'

import { mapComponent } from '../__fixtures__/mapResponse'
import { MapComponentModal, ConfirmModal } from './Modals'

let container = null
beforeEach(() => {
  container = document.createElement('div')
  container.setAttribute('id', 'root')
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('renders with ArchivesSpace resource', () => {
  render(<MapComponentModal
    isOpen={true}
    initialComponent={mapComponent}
    appElement={container}/>, container)
  const title = document.querySelector('.component__title')
  const uri = document.querySelector('.component__uri')
  expect(title.textContent).toBe('Asian Cultural Council records, Administrative Files, RG 1')
  expect(uri.textContent).toBe('/repositories/2/resources/626')
})

it('renders without ArchivesSpace resource', () => {
  render(<MapComponentModal
    isOpen={true}
    initialComponent={{}}
    appElement={container} />, container)
  const title = document.querySelector('input#resourceId')
  expect(title.textContent).toBe('')
})

it('clears ComponentDetailModal', () => {
  render(<MapComponentModal
    isOpen={true}
    initialComponent={mapComponent}
    appElement={container}
  />, container)
  const title = document.querySelector('.component__title')
  const uri = document.querySelector('.component__uri')
  expect(title.textContent).toBe('Asian Cultural Council records, Administrative Files, RG 1')
  expect(uri.textContent).toBe('/repositories/2/resources/626')

  const button = document.querySelector('.btn--sm.btn--orange')
  act(() => {
    button.click()
  })

  const updatedTitle = document.querySelector('input#resourceId')
  expect(updatedTitle.textContent).toBe('')
})

it('renders props correctly', () => {
  const component = {
    id: 5,
    title: 'Asian Cultural Council records, Grants, RG 5',
    map: 1,
    parent: null,
    tree_index: 4,
    archivesspace_uri: '/repositories/2/resources/626'
  }
  render(<ConfirmModal
    appElement={container}
    isOpen={true}
    toggle={jest.fn()}
    title='Confirm delete'
    activeItem={component}
    message={`Are you sure you want to delete ${component.title}?`}
    confirmButtonText='Yes, delete it'
    cancelButtonText='Nope, cancel'
  />, container)

  expect(document.querySelector('.modal__header-title').textContent).toBe('Confirm delete')
  expect(
    document.querySelector('.modal-message').textContent).toBe(
      `Are you sure you want to delete ${component.title}?`)
  expect(document.querySelector('.btn--blue').textContent).toBe('Yes, delete it')
  expect(document.querySelector('.btn--orange').textContent).toBe('Nope, cancel')
})
