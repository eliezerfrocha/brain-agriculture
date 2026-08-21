import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import { ProdutorForm } from './ProdutorForm';
import * as api from '../../app/api';

jest.mock('../../app/api', () => ({
  ...jest.requireActual('../../app/api'),
  useCreateProdutorMutation: jest.fn(),
  useUpdateProdutorMutation: jest.fn(),
}));

const useCreateProdutorMutationMock = api.useCreateProdutorMutation as jest.Mock;
const useUpdateProdutorMutationMock = api.useUpdateProdutorMutation as jest.Mock;

describe('ProdutorForm', () => {
  beforeEach(() => {
    useCreateProdutorMutationMock.mockReset();
    useUpdateProdutorMutationMock.mockReturnValue([jest.fn(), { isLoading: false, error: undefined }]);
  });

  it('mostra "Campo obrigatório" ao submeter vazio', async () => {
    const createProdutor = jest.fn();
    useCreateProdutorMutationMock.mockReturnValue([createProdutor, { isLoading: false, error: undefined }]);
    const user = userEvent.setup();

    renderWithProviders(<ProdutorForm />);
    await user.click(screen.getByRole('button', { name: /cadastrar produtor/i }));

    expect(await screen.findAllByText('Campo obrigatório')).toHaveLength(2);
    expect(createProdutor).not.toHaveBeenCalled();
  });

  it('envia o CPF sem máscara ao cadastrar', async () => {
    const unwrap = jest.fn().mockResolvedValue({ id: 'p1', cpfCnpj: '71543620060', nome: 'João' });
    const createProdutor = jest.fn().mockReturnValue({ unwrap });
    useCreateProdutorMutationMock.mockReturnValue([createProdutor, { isLoading: false, error: undefined }]);
    const user = userEvent.setup();

    renderWithProviders(<ProdutorForm />);
    await user.type(screen.getByLabelText(/cpf ou cnpj/i), '715.436.200-60');
    await user.type(screen.getByLabelText(/^nome$/i), 'João da Silva');
    await user.click(screen.getByRole('button', { name: /cadastrar produtor/i }));

    expect(createProdutor).toHaveBeenCalledWith({ cpfCnpj: '71543620060', nome: 'João da Silva' });
  });
});
