import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MapForm from './components/MapForm'
import MapList from './components/MapList'
import SkipLink from './components/SkipLink'

const App = () => (
  <>
    <SkipLink />
    <Header />
    <main id="main" className="content grid">
      <div className="content-wrapper pb-50">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<MapList />} />
            <Route exact path="/maps/new" element={<MapForm />} />
            <Route path="/maps/:id" element={<MapForm />} />
          </Routes>
        </BrowserRouter>
      </div>
    </main>
  </>
)

export default App
