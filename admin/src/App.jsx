import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './App.css';
// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
        <ToastContainer />
      </ScrollTop>
    </ThemeCustomization>
  );
}
