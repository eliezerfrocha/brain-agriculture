import { PageHeader } from '../components/molecules/PageHeader';
import { DashboardCharts } from '../components/organisms/DashboardCharts';

export function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral das fazendas cadastradas" />
      <DashboardCharts />
    </div>
  );
}
