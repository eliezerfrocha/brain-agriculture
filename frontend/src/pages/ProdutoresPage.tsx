import { useState } from 'react';
import { Card } from '../components/atoms/Card';
import { CrudSection } from '../components/templates/CrudSection';
import { Modal } from '../components/templates/Modal';
import { ProdutorForm } from '../components/organisms/ProdutorForm';
import { ProdutoresTable } from '../components/organisms/ProdutoresTable';
import { Produtor } from '../app/api';

export function ProdutoresPage() {
  const [editing, setEditing] = useState<Produtor | null>(null);

  return (
    <>
      <CrudSection
        title="Produtores"
        subtitle="Cadastro de produtores rurais"
        form={<ProdutorForm />}
        listTitle="Produtores cadastrados"
        list={
          <Card>
            <ProdutoresTable onEdit={setEditing} />
          </Card>
        }
      />
      {editing && (
        <Modal title="Editar produtor" onClose={() => setEditing(null)}>
          <ProdutorForm editing={editing} onDone={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
