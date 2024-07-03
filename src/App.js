import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './components/Header'
import MapForm from './components/MapForm'
import MapList from './components/MapList'
import SkipLink from './components/SkipLink'

const App = ({ appElement }) => (
  <>
    <SkipLink />
    <Header />
    <main id="main" className="content grid">
      <div className="content-wrapper pb-50">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<MapList appElement={appElement} />} />
            <Route exact path="/maps/new" element={<MapForm appElement={appElement} />} />
            <Route path="/maps/:id" element={<MapForm appElement={appElement} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </main>
  </>
)

export default App

App.propTypes = {
  appElement: PropTypes.object
}
