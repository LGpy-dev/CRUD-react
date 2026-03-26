import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="center-screen">
      <Card title="Login do Sistema">
        <form onSubmit={handleSubmit} className="form-col">
          <label>E-mail</label>
          <InputText value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Senha</label>
          <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />

          <Button type="submit" label="Entrar" icon="pi pi-sign-in" />
        </form>
      </Card>
    </div>
  );
}