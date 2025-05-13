import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Suspense>,
);
