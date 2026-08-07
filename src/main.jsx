import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as serviceWorker from './serviceWorker'

// `react-grid-layout` tries to read from `process.env` for debugging, but vite
// doesn't set up process.env, so set it up ourselves.
window.process = {
  env: {},
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
