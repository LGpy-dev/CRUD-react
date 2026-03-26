# CRUD React

Projeto com frontend em React/Vite e backend em Express/MongoDB.

## Rodando localmente

### Frontend

No diretório `projeto`:

```powershell
npm.cmd run dev
```

O frontend usa `VITE_API_URL` quando essa variável existir. Sem ela, o padrão é `http://localhost:5000/api`.

### Backend

No diretório `projeto/backend`:

```powershell
npm.cmd run dev
```

Se precisar criar o super usuário:

```powershell
npm.cmd run seed:super
```

## Deploy no Render

O repositório já inclui um arquivo `render.yaml` na raiz para criar o backend como `Web Service`.

Variáveis de ambiente esperadas no Render:

- `MONGODB_URI`
- `JWT_SECRET`
- `SUPER_PASSWORD`
- `CORS_ORIGIN`

Valores que você provavelmente vai usar:

- `CORS_ORIGIN=https://seu-frontend.onrender.com`
- `PORT` não precisa ser definido manualmente no Render

Depois de publicar o backend, configure o frontend com:

```env
VITE_API_URL=https://seu-backend.onrender.com/api
```
