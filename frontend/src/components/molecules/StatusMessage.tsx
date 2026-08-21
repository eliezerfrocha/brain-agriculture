import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem 1rem;
  text-align: center;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyWrapper = styled(Wrapper)`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const IconWrap = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.6;
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function InboxIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h4l1.5 3h5L16 12h4M4 12l1.5-6.5A1 1 0 016.5 4h11a1 1 0 01.98 1.5L20 12M4 12v6a1 1 0 001 1h14a1 1 0 001-1v-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <Wrapper>
      <Spinner />
      <Message>{label}</Message>
    </Wrapper>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <EmptyWrapper>
      <IconWrap>
        <InboxIcon />
      </IconWrap>
      <Message>{label}</Message>
    </EmptyWrapper>
  );
}
