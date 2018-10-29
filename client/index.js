// index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import App from './App.jsx'
import '../public/iotnxt.css';


const styles = {
  app: {
    paddingTop: 40,
    textAlign: 'center',
  },
}



const root = document.querySelector('#app')
ReactDOM.render(<App />, root)