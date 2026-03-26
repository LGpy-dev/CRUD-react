import { useEffect, useState } from 'react';
import AppMenu from '../components/AppMenu';
import { request } from '../services/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const roleOptions = [
  { label: 'Super', value: 'super' },
  { label: 'Administrador', value: 'adm' },
  { label: 'Usuário', value: 'user' }
];

const emptyForm = {
  _id: null,
  name: '',
  email: '',
  password: '',
  role: 'user'
};

export default function UsersPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

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
    load();
  }

  async function removeItem(row) {
    if (!confirm(`Excluir ${row.name}?`)) return;
    await request(`/users/${row._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="page">
      <AppMenu />

      <div className="page-header">
        <h2>Usuários</h2>
        <Button label="Novo usuário" icon="pi pi-plus" onClick={newItem} />
      </div>

      <DataTable value={items} paginator rows={10} stripedRows>
        <Column field="name" header="Nome" />
        <Column field="email" header="E-mail" />
        <Column field="role" header="Perfil" />
        <Column
          header="Ações"
          body={(row) => (
            <div className="row-actions">
              <Button icon="pi pi-pencil" text onClick={() => editItem(row)} />
              <Button icon="pi pi-trash" text severity="danger" onClick={() => removeItem(row)} />
            </div>
          )}
        />
      </DataTable>

      <Dialog header="Usuário" visible={open} style={{ width: '30rem' }} onHide={() => setOpen(false)}>
        <div className="form-col">
          <label>Nome</label>
          <InputText value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label>E-mail</label>
          <InputText value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

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
    </div>
  );
}