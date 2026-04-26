import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../style.css'; // Importing the existing vanilla CSS to keep the styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
