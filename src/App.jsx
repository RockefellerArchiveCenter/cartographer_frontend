import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './components/Header/index.jsx'
import MapForm from './components/MapForm/index.jsx'
import MapList from './components/MapList/index.jsx'
import SkipLink from './components/SkipLink/index.jsx'

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
