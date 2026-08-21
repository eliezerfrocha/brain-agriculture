import { useState } from 'react';
import { CrudSection } from '../components/templates/CrudSection';
import { Modal } from '../components/templates/Modal';
import { PropriedadeForm } from '../components/organisms/PropriedadeForm';
import { PropriedadesTable } from '../components/organisms/PropriedadesTable';
import { Propriedade } from '../app/api';

export function PropriedadesPage() {
  const [editing, setEditing] = useState<Propriedade | null>(null);

  return (
    <>
      <CrudSection
        title="Propriedades"
        subtitle="Fazendas vinculadas aos produtores"
        form={<PropriedadeForm />}
        listTitle="Propriedades cadastradas"
        listNote="O mapa mostra um traçado ilustrativo do talhão, posicionado na região da cidade/estado da propriedade — não é a localização real (o cadastro não coleta latitude/longitude)."
        list={<PropriedadesTable onEdit={setEditing} />}
      />
      {editing && (
        <Modal title="Editar propriedade" onClose={() => setEditing(null)}>
          <PropriedadeForm editing={editing} onDone={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
