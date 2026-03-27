import { useEffect, useRef, useState } from 'react';
import AppMenu from '../components/AppMenu';
import { request } from '../services/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useAuth } from '../context/AuthContext';

const roleOptions = [
  { label: 'Administrador', value: 'adm' },
  { label: 'Usuario', value: 'user' }
];

const emptyForm = {
  _id: null,
  name: '',
  email: '',
  password: '',
  role: 'user'
};

export default function UsersPage() {
  const { user } = useAuth();
  const canManage = user?.role !== 'user';
  const toast = useRef(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedItem, setSelectedItem] = useState(null);

  async function load() {
    const data = await request('/users');
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  function newItem() {
    setForm(emptyForm);
    setOpen(true);
  }

  function editItem(row) {
    setForm({ ...row, password: '' });
    setOpen(true);
  }

  function viewItem(row) {
    setSelectedItem(row);
    setViewOpen(true);
  }

  async function save() {
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      ...(form.password ? { password: form.password } : {})
    };

    if (form._id) {
      await request(`/users/${form._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } else {
      await request('/users', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    setOpen(false);
    await load();
    toast.current?.show({
      severity: 'success',
      summary: form._id ? 'Usuário atualizado' : 'Usuário criado',
      detail: `${form.name} foi salvo com sucesso.`,
      life: 2500
    });
  }

  async function removeItem(row) {
    confirmDialog({
      message: `Deseja excluir ${row.name}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await request(`/users/${row._id}`, { method: 'DELETE' });
        await load();
        toast.current?.show({
          severity: 'success',
          summary: 'Usuário removido',
          detail: `${row.name} foi excluído com sucesso.`,
          life: 2500
        });
      }
    });
  }

  return (
    <div className="page">
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />
      <AppMenu />

      <div className="page-content">
        <div className="page-header">
          <div className="page-title">
            <h2>Usuarios</h2>
            <p>Visualize perfis cadastrados e mantenha o controle de acessos.</p>
          </div>
          {canManage && <Button label="Novo usuario" icon="pi pi-plus" onClick={newItem} />}
        </div>

        <DataTable value={items} paginator rows={10} stripedRows className="data-shell">
          <Column field="name" header="Nome" />
          <Column field="email" header="E-mail" />
          <Column field="role" header="Perfil" />
          <Column
            header="Ações"
            body={(row) => (
              <div className="row-actions">
                <Button icon="pi pi-eye" text label="Visualizar" className="action-button action-view" onClick={() => viewItem(row)} />
                {canManage && <Button icon="pi pi-pencil" text label="Editar" className="action-button action-edit" onClick={() => editItem(row)} />}
                {canManage && <Button icon="pi pi-trash" text severity="danger" label="Excluir" className="action-button action-delete" onClick={() => removeItem(row)} />}
              </div>
            )}
          />
        </DataTable>
      </div>

      <Dialog header="Visualizar usuário" visible={viewOpen} style={{ width: '30rem' }} onHide={() => setViewOpen(false)}>
        <div className="form-col">
          <label>Nome</label>
          <InputText value={selectedItem?.name || ''} readOnly />

          <label>E-mail</label>
          <InputText value={selectedItem?.email || ''} readOnly />

          <label>Perfil</label>
          <InputText value={selectedItem?.role || ''} readOnly />
        </div>
      </Dialog>

      {canManage && (
        <Dialog header="Usuario" visible={open} style={{ width: '30rem' }} onHide={() => setOpen(false)}>
          <div className="form-col">
            <label>Nome</label>
            <InputText value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <label>E-mail</label>
            <InputText
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
            />

            <label>Senha</label>
            <InputText value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

            <label>Perfil</label>
            <Dropdown
              value={form.role}
              options={roleOptions}
              onChange={(e) => setForm({ ...form, role: e.value })}
            />

            <Button label="Salvar" onClick={save} />
          </div>
        </Dialog>
      )}
    </div>
  );
}
