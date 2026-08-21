import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import { LoginForm } from './LoginForm';
import * as api from '../../app/api';

jest.mock('../../app/api', () => ({
  ...jest.requireActual('../../app/api'),
  useLoginMutation: jest.fn(),
}));

const useLoginMutationMock = api.useLoginMutation as jest.Mock;

describe('LoginForm', () => {
  beforeEach(() => {
    useLoginMutationMock.mockReset();
  });

  it('mostra "Campo obrigatório" ao submeter vazio', async () => {
    const login = jest.fn();
    useLoginMutationMock.mockReturnValue([login, { isLoading: false, error: undefined }]);
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findAllByText('Campo obrigatório')).toHaveLength(2);
    expect(login).not.toHaveBeenCalled();
  });

  it('faz login com sucesso e grava o token no estado', async () => {
    const login = jest.fn().mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          accessToken: 'fake-token',
          usuario: { id: 'user-1', email: 'admin@brainagriculture.com', nome: 'Administrador' },
        }),
    });
    useLoginMutationMock.mockReturnValue([login, { isLoading: false, error: undefined }]);
    const user = userEvent.setup();

    const { store } = renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/e-mail/i), 'admin@brainagriculture.com');
    await user.type(screen.getByLabelText(/senha/i), 'Admin@123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(login).toHaveBeenCalledWith({
      email: 'admin@brainagriculture.com',
      password: 'Admin@123',
    });
    await screen.findByRole('button', { name: /entrar/i });
    expect(store.getState().auth.token).toBe('fake-token');
  });

  it('mostra a mensagem de erro retornada pela API', async () => {
    const login = jest.fn().mockReturnValue({
      unwrap: () => Promise.reject({ data: { message: 'E-mail ou senha inválidos' } }),
    });
    useLoginMutationMock.mockReturnValue([
      login,
      { isLoading: false, error: { data: { message: 'E-mail ou senha inválidos' } } },
    ]);
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/e-mail/i), 'errado@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'senha-errada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument();
  });
});
