import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../app/api';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../app/authSlice';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ErrorText } from '../atoms/Text';
import { FormStack } from '../atoms/FormLayout';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import { useToast } from '../../app/ToastProvider';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showToast = useToast();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!email.trim() || !password.trim()) {
      showToast('error', 'Preencha os campos obrigatórios.');
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: result.accessToken, usuario: result.usuario }));
      navigate('/', { replace: true });
    } catch {
      // erro já exposto abaixo via `error` do hook
    }
  }

  const errorMessage = extractErrorMessage(error, 'Não foi possível entrar. Tente novamente.');

  return (
    <FormStack onSubmit={handleSubmit}>
      <FormField
        label="E-mail"
        htmlFor="email"
        error={submitted && !email.trim() ? 'Campo obrigatório' : undefined}
      >
        <Input
          id="email"
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
        />
      </FormField>
      <FormField
        label="Senha"
        htmlFor="password"
        error={submitted && !password.trim() ? 'Campo obrigatório' : undefined}
      >
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </FormField>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      <Button type="submit" disabled={isLoading} $fullWidth>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </FormStack>
  );
}
