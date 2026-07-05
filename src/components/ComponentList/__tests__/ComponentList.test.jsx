import { render, act } from '@testing-library/react'

import { mapResponse } from '../../../__fixtures__/mapResponse'
import ComponentList from '../index.jsx'

vi.mock('axios')

global.ResizeObserver = vi.fn(class {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
});

let container = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
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