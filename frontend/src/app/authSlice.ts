import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'brain-agriculture:auth';

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
}

interface AuthState {
  token: string | null;
  usuario: AuthUser | null;
}

function loadInitialState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, usuario: null };
    return JSON.parse(raw) as AuthState;
  } catch {
    return { token: null, usuario: null };
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; usuario: AuthUser }>) {
      state.token = action.payload.token;
      state.usuario = action.payload.usuario;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    logout(state) {
      state.token = null;
      state.usuario = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export function selectToken(state: { auth: AuthState }) {
  return state.auth.token;
}

export function selectUsuario(state: { auth: AuthState }) {
  return state.auth.usuario;
}

export function selectIsAuthenticated(state: { auth: AuthState }) {
  return Boolean(state.auth.token);
}
