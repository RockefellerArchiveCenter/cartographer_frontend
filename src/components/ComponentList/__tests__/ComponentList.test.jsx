import { render, act } from '@testing-library/react'
import { SortableTree } from '@nosferatu500/react-sortable-tree'

import { mapResponse } from '../../../__fixtures__/mapResponse'
import ComponentList from '../index.jsx'

vi.mock('axios')
vi.mock('@nosferatu500/react-sortable-tree', async () => {
  const actual = await vi.importActual(
    '@nosferatu500/react-sortable-tree'
  )

  return {
    ...actual,

    SortableTree: vi.fn(
      ({ treeData, generateNodeProps, onChange, getNodeKey }) => (
        <div data-testid="sortable-tree">
          {treeData.map((node) => {
            const props = generateNodeProps({
              node,
              path: [node.id],
              treeIndex: 0,
            })

            return (
              <div
                key={node.id}
                data-testid={`node-${node.id}`}
              >
                <span>{node.title}</span>

                {props.buttons}

                <button
                  onClick={() => onChange([...treeData])}
                >
                  Trigger Change
                </button>
              </div>
            )
          })}
        </div>
      )
    ),
  }
})

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
  await act(async () => {
    render(<ComponentList
      items={mapResponse.children}
      onChange={vi.fn()}
      appElement={container} />)
  })
  expect(SortableTree).toHaveBeenCalledTimes(1)

  const props = SortableTree.mock.calls[0][0]

  expect(props.treeData).toEqual(mapResponse.children)
  expect(props.onChange).toBeInstanceOf(Function)
  expect(props.getNodeKey).toBeInstanceOf(Function)
  expect(props.generateNodeProps).toBeInstanceOf(Function)

})

it('Add button toggles component detail modal', async () => {
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

it('Add child button toggles detail modal', async () => {
  await act(async () => {
    render(<ComponentList
      items={mapResponse.children}
      onChange={vi.fn()}
      appElement={container} />)
  })

  expect(document.querySelector('.modal__header')).not.toBeInTheDocument()

  const button = document.querySelector('.btn--sm.btn--blue')
  act(() => button.click())

  expect(document.querySelector('.modal__header-title').textContent).toBe('Arrangement Map Component')
  expect(document.querySelector('.component__title')).not.toBeInTheDocument()
})

it('Edit button toggles detail modal', async () => {
  await act(async () => {
    render(<ComponentList
      items={mapResponse.children}
      onChange={vi.fn()}
      appElement={container} />)
  })

  expect(document.querySelector('.modal__header')).not.toBeInTheDocument()

  const button = document.querySelector('.btn--sm.btn--dark-gray')
  act(() => button.click())

  expect(document.querySelector('.modal__header-title').textContent).toBe('Arrangement Map Component')
  expect(document.querySelector('.component__title').textContent).toBe('Asian Cultural Council records, Administrative Files, RG 1')
})

it('Delete child button toggles confirm modal', async () => {
  await act(async () => {
    render(<ComponentList
      items={mapResponse.children}
      onChange={vi.fn()}
      appElement={container} />)
  })

  expect(document.querySelector('.modal__header')).not.toBeInTheDocument()

  const button = document.querySelector('.btn--sm.btn--orange')
  act(() => button.click())

  expect(document.querySelector('.modal__header-title').textContent).toBe('Confirm delete')
})