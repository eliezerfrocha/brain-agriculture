import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import { FormField } from './FormField';
import { Input } from '../atoms/Input';

function renderField(props: Partial<ComponentProps<typeof FormField>> = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <FormField label="Nome" htmlFor="nome" {...props}>
        <Input id="nome" />
      </FormField>
    </ThemeProvider>,
  );
}

describe('FormField', () => {
  it('renderiza o label associado ao campo', () => {
    renderField();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('não mostra mensagem de erro quando não há erro', () => {
    renderField();
    expect(screen.queryByText('Campo obrigatório')).not.toBeInTheDocument();
  });

  it('mostra a mensagem de erro quando fornecida', () => {
    renderField({ error: 'Campo obrigatório' });
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });
});
