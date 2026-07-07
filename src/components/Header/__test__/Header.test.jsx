import axios from 'axios'
import { render } from '@testing-library/react'

import Header from '../index.jsx'


it('renders without crashing', () => {
    render(<Header/>)
})