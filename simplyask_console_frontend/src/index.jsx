import './index.css';
import './Assets/externalCSS/MontserratFont/MontserratFont.css';

import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import RecoilProvider from './Components/providers/RecoilProvider';
import { theme } from './config/theme';
import { UserProvider } from './contexts/UserContext';
import reportWebVitals from './reportWebVitals';
import WebFont from 'webfontloader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'online',
      refetchOnWindowFocus: false,
    },
    mutations: {
      networkMode: 'online',
    },
  },
});

WebFont.load({
  google: {
    families: [
      'Roboto',
      'Open Sans',
      'Noto Sans JP',
      'Poppins',
      'Lato',
      'Roboto Condensed',
      'Inter',
      'Barlow',
      'Quicksand',
      'PlayfairDisplay',
      'Quicksand',
      'Oswald',
      'Tangerine',
      'Barlow',
    ],
  },
});

const router = createBrowserRouter([{ path: '*', Component: App }]);

const container = document.getElementById('root');

const root = ReactDOM.createRoot(container);

root.render(
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <RecoilProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </RecoilProvider>
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  </UserProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
