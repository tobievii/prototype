import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'


const root = document.querySelector('#app')
ReactDOM.render(<App />, root);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker.js')
        .then(function (registration) {
        })
        .catch(function (error) {
        });
}
