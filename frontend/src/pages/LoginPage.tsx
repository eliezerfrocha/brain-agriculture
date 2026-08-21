import styled from 'styled-components';
import { Card } from '../components/atoms/Card';
import { BrandAccent } from '../components/atoms/BrandAccent';
import { LoginForm } from '../components/organisms/LoginForm';

const Screen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 1.5rem;
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 380px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const Title = styled.h1`
  font-size: 1.3rem;
  text-align: center;
  margin: 0 0 0.4rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  margin: 0 0 1.75rem;
`;

export function LoginPage() {
  return (
    <Screen>
      <Panel>
        <Title>
          Brain <BrandAccent>Agriculture</BrandAccent>
        </Title>
        <Subtitle>Entre com sua conta para continuar</Subtitle>
        <LoginForm />
      </Panel>
    </Screen>
  );
}
