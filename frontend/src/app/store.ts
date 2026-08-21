import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { ibgeApi } from './ibgeApi';
import { authReducer } from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [ibgeApi.reducerPath]: ibgeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, ibgeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
