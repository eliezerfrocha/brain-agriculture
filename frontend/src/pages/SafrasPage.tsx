import { Card } from '../components/atoms/Card';
import { CrudSection } from '../components/templates/CrudSection';
import { CatalogForm } from '../components/organisms/CatalogForm';
import { CatalogList } from '../components/organisms/CatalogList';
import {
  useGetSafrasQuery,
  useCreateSafraMutation,
  useUpdateSafraMutation,
  useDeleteSafraMutation,
} from '../app/api';

export function SafrasPage() {
  const { data: safras, isLoading } = useGetSafrasQuery();
  const [createSafra] = useCreateSafraMutation();
  const [updateSafra] = useUpdateSafraMutation();
  const [deleteSafra] = useDeleteSafraMutation();

  return (
    <CrudSection
      title="Safras"
      subtitle="Ciclos de plantio disponíveis para vincular às propriedades"
      form={
        <CatalogForm
          label="Nome da safra"
          placeholder="Safra 2023"
          successMessage="Safra cadastrada com sucesso."
          onCreate={(nome) => createSafra({ nome }).unwrap()}
        />
      }
      listTitle="Safras cadastradas"
      list={
        <Card>
          <CatalogList
            items={safras}
            isLoading={isLoading}
            emptyLabel="Nenhuma safra cadastrada ainda."
            columnLabel="Safra"
            itemLabel="safra"
            onUpdate={(id, nome) => updateSafra({ id, nome }).unwrap()}
            onDelete={(id) => deleteSafra(id).unwrap()}
          />
        </Card>
      }
    />
  );
}
