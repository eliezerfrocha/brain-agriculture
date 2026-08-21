import {
  authReducer,
  setCredentials,
  logout,
  selectToken,
  selectUsuario,
  selectIsAuthenticated,
} from './authSlice';

const usuario = { id: 'user-1', email: 'admin@brainagriculture.com', nome: 'Administrador' };

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('estado inicial é deslogado', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.token).toBeNull();
    expect(state.usuario).toBeNull();
  });

  it('setCredentials grava token/usuário no estado e no localStorage', () => {
    const state = authReducer(undefined, setCredentials({ token: 'abc123', usuario }));

    expect(state.token).toBe('abc123');
    expect(state.usuario).toEqual(usuario);
    expect(JSON.parse(localStorage.getItem('brain-agriculture:auth')!)).toEqual(state);
  });

  it('logout limpa o estado e o localStorage', () => {
    const loggedIn = authReducer(undefined, setCredentials({ token: 'abc123', usuario }));
    const loggedOut = authReducer(loggedIn, logout());

    expect(loggedOut.token).toBeNull();
    expect(loggedOut.usuario).toBeNull();
    expect(localStorage.getItem('brain-agriculture:auth')).toBeNull();
  });

  describe('selectors', () => {
    it('selectToken/selectUsuario/selectIsAuthenticated refletem o estado', () => {
      const rootState = { auth: { token: 'abc123', usuario } };
      expect(selectToken(rootState)).toBe('abc123');
      expect(selectUsuario(rootState)).toEqual(usuario);
      expect(selectIsAuthenticated(rootState)).toBe(true);

      const loggedOutState = { auth: { token: null, usuario: null } };
      expect(selectIsAuthenticated(loggedOutState)).toBe(false);
    });
  });
});
