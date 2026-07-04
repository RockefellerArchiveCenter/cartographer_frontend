import axios from 'axios'
import { render } from '@testing-library/react'

import SkipLink from '../index.jsx'


it('renders without crashing', () => {
    let container = document.createElement('div')
    document.body.appendChild(container)
    render(<SkipLink/>, container)
})