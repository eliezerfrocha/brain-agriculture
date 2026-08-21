import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectUsuario } from '../../app/authSlice';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { BrandAccent } from '../atoms/BrandAccent';
import { media } from '../../styles/breakpoints';

const Shell = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;

  ${media.tablet} {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.sidebar};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem 1rem;

  ${media.tablet} {
    width: 100%;
    height: auto;
    overflow: visible;
    position: sticky;
    top: 0;
    z-index: 10;
    flex-direction: row;
    align-items: center;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 0.85rem 1.25rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const Brand = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0 0.75rem;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;

  ${media.tablet} {
    margin-bottom: 0;
    padding: 0;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0 0.75rem 1.25rem;
  width: auto;

  ${media.tablet} {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  ${media.tablet} {
    flex-direction: row;
    flex: 1;
    overflow-x: auto;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background-color 0.15s ease, transform 0.15s ease, color 0.15s ease;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    transform: translateX(2px);
  }

  &.active {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

function DashboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ProdutoresIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PropriedadesIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SafrasIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 9h17" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CulturasIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M12 21v-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const AccountCard = styled.div`
  margin-top: auto;
  padding: 0.75rem 0.75rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  ${media.tablet} {
    margin-top: 0;
    padding: 0;
    border-top: none;
    flex-shrink: 0;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  flex: 1;
`;

const AccountText = styled.div`
  min-width: 0;
`;

const AccountName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AccountEmail = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.tablet} {
    display: none;
  }
`;

const SairButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  color: ${({ theme }) => theme.colors.danger};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.dangerBg};
    border-radius: 50%;
  }
`;

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Main = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 2.5rem 3rem;
  animation: page-fade-in 0.28s ease-out;

  @keyframes page-fade-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${media.tablet} {
    height: auto;
    overflow: visible;
    padding: 1.5rem;
  }

  ${media.mobile} {
    padding: 1rem;
  }
`;

const MainInner = styled.div`
  max-width: 1100px;
`;

export function PageLayout({ children }: { children: ReactNode }) {
  const usuario = useAppSelector(selectUsuario);
  const dispatch = useAppDispatch();
  const location = useLocation();

  return (
    <Shell>
      <Sidebar>
        <Brand>
          Brain <BrandAccent>Agriculture</BrandAccent>
        </Brand>
        <Divider />
        <Nav>
          <StyledNavLink to="/" end>
            <DashboardIcon />
            Dashboard
          </StyledNavLink>
          <StyledNavLink to="/produtores">
            <ProdutoresIcon />
            Produtores
          </StyledNavLink>
          <StyledNavLink to="/propriedades">
            <PropriedadesIcon />
            Propriedades
          </StyledNavLink>
          <StyledNavLink to="/safras">
            <SafrasIcon />
            Safras
          </StyledNavLink>
          <StyledNavLink to="/culturas">
            <CulturasIcon />
            Culturas
          </StyledNavLink>
        </Nav>
        {usuario && (
          <AccountCard>
            <AccountInfo>
              <Avatar nome={usuario.nome} size={30} />
              <AccountText>
                <AccountName>{usuario.nome}</AccountName>
                <AccountEmail>{usuario.email}</AccountEmail>
              </AccountText>
            </AccountInfo>
            <SairButton
              type="button"
              $variant="ghost"
              onClick={() => dispatch(logout())}
              title="Sair"
              aria-label="Sair"
            >
              <LogoutIcon />
            </SairButton>
          </AccountCard>
        )}
      </Sidebar>
      <Main key={location.pathname}>
        <MainInner>{children}</MainInner>
      </Main>
    </Shell>
  );
}
