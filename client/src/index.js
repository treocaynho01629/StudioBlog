import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ContextProvider } from './context/Context';
import { store } from './app/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ContextProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </ContextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
