import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
window.React = React

const root = document.createElement("div")
root.className = "w-full h-full";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);

// const root = ReactDOM.createRoot(document.getElementById('root'));
rootDiv.render(
    // <React.StrictMode>
    //   <App />
    // </React.StrictMode>
    <App />
);

