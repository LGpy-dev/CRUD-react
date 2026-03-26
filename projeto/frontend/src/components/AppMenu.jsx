import { Link } from 'react-router';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext';

export default function AppMenu() {
    const { user, logout } = useAuth();

    return (
        <div className="topbar">
            <div className="menu-links">
                <Link to="/">DashBoard</Link>
                {(user?.role === 'super' || user?.role === 'user') && <Link to="/users">Usuários</Link>}
                <Link to="/clients">Clientes</Link>
                <Link to="/products">Produtos</Link>
            </div>

            <div className="menu-right">
                <span>{user?.name} ({user?.role})</span>
                <Button label="Sair" icon="pi pi-sign-out" severity="secondary" onClick={logout}/>
            </div>
        </div>
    );
}