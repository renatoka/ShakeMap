import App from './App';
import './index.css';
import ErrorPage from './pages/Error/Error';
import Unsubscribe from './pages/Unsubscribe/Unsubscribe';
import { store } from './redux/store';
import './translations/i18n';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage title="Error" description="Page not found" />,
  },
  {
    path: '/unsubscribe/:token',
    element: <Unsubscribe />,
    errorElement: <ErrorPage title="Error" description="Page not found" />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
