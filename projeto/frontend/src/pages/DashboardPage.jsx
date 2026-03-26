import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import AppMenu from '../components/AppMenu';
import { request } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, clients: 0, products: 0 });

  useEffect(() => {
    request('/dashboard').then(setStats).catch(console.error);
  }, []);

  return (
    <div className="page">
      <AppMenu />

      <div className="grid-cards">
        <Card title="Usuários">
          <h2>{stats.users}</h2>
        </Card>

        <Card title="Clientes">
          <h2>{stats.clients}</h2>
        </Card>

        <Card title="Produtos">
          <h2>{stats.products}</h2>
        </Card>
      </div>
    </div>
  );
}