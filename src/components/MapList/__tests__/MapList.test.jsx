import axios from 'axios'
import { render, act } from '@testing-library/react'

import { mapResponse } from '../../../__fixtures__/mapResponse'
import MapList from '../index.jsx'

vi.mock('axios')

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

it('renders with data', async () => {
  axios.get.mockImplementation((url) => Promise.resolve({ data: { results: [mapResponse] } }))

  await act(async () => {
    await render(<MapList appElement={container} />, container)
  })

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(
    document.querySelector('.mapList').textContent).toContain(
    'Asian Cultural Council records')
})

it('renders without data', async () => {
  axios.get.mockImplementation((url) => Promise.resolve({ data: { results: [] } }))

  await act(async () => {
    await render(<MapList appElement={container} />, container)
  })

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.mapList').textContent).toBe('No Arrangement Maps yet')
})

it('deletes map', async () => {
  axios.get.mockImplementation(() => Promise.resolve({ data: { results: [mapResponse] } }))
  axios.delete.mockImplementation(() => Promise.resolve({ detail: 'Map deleted' }))

  await act(async () => {
    await render(<MapList appElement={container} />, container)
  })

  const modalButton = document.querySelector('.btn--sm.btn--orange')
  act(() => {
    modalButton.click()
  })

  const deleteButton = document.querySelector('.btn--md.btn--blue')
  await act(async () => {
    await deleteButton.click()
  })

  expect(axios.delete).toHaveBeenCalledTimes(1)
})
