import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapForm from "./components/MapForm";
import MapList from "./components/MapList";

import {
  Button,
  Navbar,
  NavbarBrand,
  Nav} from 'reactstrap';

const App = () => (
  <main className="content">
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/">Cartographer</NavbarBrand>
      <Nav className="ml-auto" navbar>
        <Button href="/maps/new" color="primary">Add New Map</Button>
      </Nav>
    </Navbar>
    <div className="row mt-4">
      <div className="col-md-8 col-10 mx-auto p-0">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<MapList />} />
          <Route exact path="/maps/new" element={<MapForm />} />
          <Route path="/maps/:id" element={<MapForm />} />
        </Routes>
      </BrowserRouter>
      </div>
    </div>
  </main>
)

export default App;
