import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import { AreaUsageBar } from './AreaUsageBar';

function renderBar(props: ComponentProps<typeof AreaUsageBar>) {
  return render(
    <ThemeProvider theme={theme}>
      <AreaUsageBar {...props} />
    </ThemeProvider>,
  );
}

describe('AreaUsageBar', () => {
  it('mostra os valores de área agricultável e vegetação formatados', () => {
    renderBar({ areaAgricultavel: 650, areaVegetacao: 350, areaTotal: 1000 });

    expect(screen.getByText(/Agricultável: 650 ha/)).toBeInTheDocument();
    expect(screen.getByText(/Vegetação: 350 ha/)).toBeInTheDocument();
  });

  it('não quebra quando a área total é zero', () => {
    renderBar({ areaAgricultavel: 0, areaVegetacao: 0, areaTotal: 0 });

    expect(screen.getByText(/Agricultável: 0 ha/)).toBeInTheDocument();
  });
});
