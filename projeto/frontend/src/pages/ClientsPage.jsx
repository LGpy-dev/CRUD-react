import { useEffect, useState } from 'react';
import AppMenu from '../components/AppMenu';
import { request } from '../services/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

const emptyForm = {
  _id: null,
  name: '',
  email: '',
  phone: '',
  document: ''
};

export default function ClientsPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const data = await request('/clients');
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
    setForm(row);
    setOpen(true);
  }

  async function save() {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      document: form.document
    };

    if (form._id) {
      await request(`/clients/${form._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } else {
      await request('/clients', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    setOpen(false);
    load();
  }

  async function removeItem(row) {
    if (!confirm(`Excluir ${row.name}?`)) return;
    await request(`/clients/${row._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="page">
      <AppMenu />

      <div className="page-header">
        <h2>Clientes</h2>
        <Button label="Novo cliente" icon="pi pi-plus" onClick={newItem} />
      </div>

      <DataTable value={items} paginator rows={10} stripedRows>
        <Column field="name" header="Nome" />
        <Column field="email" header="E-mail" />
        <Column field="phone" header="Telefone" />
        <Column field="document" header="Documento" />
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

      <Dialog header="Cliente" visible={open} style={{ width: '30rem' }} onHide={() => setOpen(false)}>
        <div className="form-col">
          <label>Nome</label>
          <InputText value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label>E-mail</label>
          <InputText value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <label>Telefone</label>
          <InputText value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <label>Documento</label>
          <InputText value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} />

          <Button label="Salvar" onClick={save} />
        </div>
      </Dialog>
    </div>
  );
}