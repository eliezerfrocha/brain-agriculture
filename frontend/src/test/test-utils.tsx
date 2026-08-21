import { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { api } from '../app/api';
import { ibgeApi } from '../app/ibgeApi';
import { authReducer } from '../app/authSlice';
import { theme } from '../styles/theme';
import { ToastProvider } from '../app/ToastProvider';

export function createTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
      [ibgeApi.reducerPath]: ibgeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, ibgeApi.middleware),
  });
}

interface WrapperProps {
  children: ReactNode;
}

export function renderWithProviders(ui: ReactElement, { route = '/' } = {}) {
  const store = createTestStore();

  function Wrapper({ children }: WrapperProps) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <MemoryRouter
              initialEntries={[route]}
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              {children}
            </MemoryRouter>
          </ToastProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
