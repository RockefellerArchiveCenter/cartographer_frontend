import { render, act } from '@testing-library/react'

import { Route, Routes, MemoryRouter } from 'react-router-dom'
import axios from 'axios'

import { mapResponse } from '../../../__fixtures__/mapResponse'
import MapForm from '../index.jsx'

vi.mock('axios')

global.ResizeObserver = vi.fn(class {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
});

let container = null
beforeEach(() => {
  vi.resetAllMocks()
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  container.remove()
  container = null
})

vi.mock('axios')

it('renders without match', () => {
  act(() => {
    render(
        <MemoryRouter initialEntries={['/maps']}>
          <Routes>
            <Route path='/maps' element={<MapForm appElement={container} />} />
          </Routes>
        </MemoryRouter>, container)
  })

  expect(document.querySelector('h1').textContent).toBe('Add New Map')
})

it('renders with match', async () => {
  axios.get.mockImplementationOnce(() => Promise.resolve({ data: mapResponse }))

  await act(async () => {
    await render(
        <MemoryRouter initialEntries={['/maps/1']}>
          <Routes>
            <Route path='/maps/:id' element={<MapForm appElement={container} />} />
          </Routes>
        </MemoryRouter>, container)
  })

  expect(document.querySelector('h1').textContent).toBe('Edit Map')
  expect(document.querySelector('.btn--publish')).toBeVisible()
  expect(document.querySelector('input#title')).toBeDisabled()
})

it('toggles editable', async () => {
  axios.get.mockImplementationOnce(() => Promise.resolve({ data: mapResponse }))

  await act(async () => {
    await render(
        <MemoryRouter initialEntries={['/maps/1']}>
          <Routes>
            <Route path='/maps/:id' element={<MapForm appElement={container} />} />
          </Routes>
        </MemoryRouter>, container)
  })

  const editButton = document.querySelector('.btn--edit')
  act(() => {
    editButton.click()
  })
  expect(document.querySelector('input#title')).not.toBeDisabled()

  const cancelButton = document.querySelector('.btn--cancel-edit')
  act(() => {
    cancelButton.click()
  })
  expect(document.querySelector('input#title')).toBeDisabled()
})

it('handles publish correctly', async () => {
  axios.get.mockImplementation(() => Promise.resolve({ data: mapResponse }))
  axios.put.mockImplementationOnce(() => Promise.resolve({ mapResponse }))

  await act(async () => {
    await render(
        <MemoryRouter initialEntries={['/maps/1']}>
          <Routes>
            <Route path='/maps/:id' element={<MapForm appElement={container} />} />
          </Routes>
        </MemoryRouter>, container)
  })

  const modalButton = document.querySelector('.btn--publish')
  expect(modalButton.textContent).toBe('Publish Map')

  // Toggle publish modal
  act(() => {
    modalButton.click()
  })
  expect(document.querySelector('.modal--confirm')).toBeVisible()

  const publishButton = document.querySelector('.modal--confirm .btn--blue')

  // Publish current map
  await act(async () => {
    await publishButton.click()
  })

  expect(axios.put).toHaveBeenCalledTimes(1)
  expect(modalButton.textContent).toBe('Unpublish Map')
})
