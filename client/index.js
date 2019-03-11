import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import * as serviceWorker from './serviceWorker.js';

const root = document.querySelector('#app')
ReactDOM.render(<App />, root),
    serviceWorker.register()

