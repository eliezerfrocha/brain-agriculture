import { Card } from '../components/atoms/Card';
import { CrudSection } from '../components/templates/CrudSection';
import { CatalogForm } from '../components/organisms/CatalogForm';
import { CatalogList } from '../components/organisms/CatalogList';
import {
  useGetCulturasQuery,
  useCreateCulturaMutation,
  useUpdateCulturaMutation,
  useDeleteCulturaMutation,
} from '../app/api';

export function CulturasPage() {
  const { data: culturas, isLoading } = useGetCulturasQuery();
  const [createCultura] = useCreateCulturaMutation();
  const [updateCultura] = useUpdateCulturaMutation();
  const [deleteCultura] = useDeleteCulturaMutation();

  return (
    <CrudSection
      title="Culturas"
      subtitle="Catálogo de culturas disponíveis para plantio"
      form={
        <CatalogForm
          label="Nome da cultura"
          placeholder="Soja"
          successMessage="Cultura cadastrada com sucesso."
          onCreate={(nome) => createCultura({ nome }).unwrap()}
        />
      }
      listTitle="Culturas cadastradas"
      list={
        <Card>
          <CatalogList
            items={culturas}
            isLoading={isLoading}
            emptyLabel="Nenhuma cultura cadastrada ainda."
            columnLabel="Cultura"
            itemLabel="cultura"
            onUpdate={(id, nome) => updateCultura({ id, nome }).unwrap()}
            onDelete={(id) => deleteCultura(id).unwrap()}
          />
        </Card>
      }
    />
  );
}
