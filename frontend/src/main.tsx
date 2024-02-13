import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './firebase'

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <>
    <App />
    <ToastContainer position="bottom-center" hideProgressBar theme="dark" closeOnClick draggable transition={Slide} autoClose={1000} />
  </>
);