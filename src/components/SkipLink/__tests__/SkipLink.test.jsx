import axios from 'axios'
import { render } from '@testing-library/react'

import SkipLink from '../index.jsx'


it('renders without crashing', () => {
    render(<SkipLink/>)
})