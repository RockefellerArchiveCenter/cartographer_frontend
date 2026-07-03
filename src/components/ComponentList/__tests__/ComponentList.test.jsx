import React from 'react'
import '@testing-library/jest-dom'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'

import { mapResponse } from '../../../__fixtures__/mapResponse'
import ComponentList from '../index.jsx'

vi.mock('axios')

let container = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('renders without crashing', async () => {
  act(() => {
    render(<ComponentList
      items={mapResponse.children}
      onChange={vi.fn()}
      appElement={container} />, container)
  })
})

it('toggles component detail modal', async () => {
  await act(async () => {
    await render(<ComponentList
      items={mapResponse.children}
      onChange={vi.fn()}
      appElement={container} />, container)
  })

  const primary = document.querySelector('.btn--md.btn--orange')
  expect(document.querySelector('.modal--component')).toBeNull()

  await act(async () => await primary.click())
  expect(document.querySelector('.modal--component')).toBeVisible()
})
