import axios from 'axios'
import { render } from '@testing-library/react'

import Button from '../index.jsx'


it('renders with expected props', () => {
    const onClick = vi.fn()
    render(
        <Button
            type='submit'
            className='btn--sm'
            onClick={onClick}
            ariaLabel='ARIA label'
            ariaHasPopup={false}
            ariaExpanded={false}
            ariaPressed={false}
            disabled={true}
            label='label'
            />)

    const button = document.getElementsByClassName('btn')[0]
    expect(button.getAttribute('type')).toBe('submit')
    expect(button.getAttribute('class')).toBe('btn btn--sm')
    expect(button.getAttribute('aria-label')).toBe('ARIA label')
    expect(button.getAttribute('aria-haspopup')).toBe('false')
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.getAttribute('disabled')).toBe('')
    expect(button.textContent).toBe('label')
})