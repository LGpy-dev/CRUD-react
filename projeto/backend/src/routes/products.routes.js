import { Router } from 'express';
import Product from '../models/Product.js';
import { auth, permit } from '../middleware/auth.js';

const router = Router();

// LISTAR: todos podem ver
router.get('/', auth, permit('super', 'adm', 'user'), async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// CRIAR: só super e adm
router.post('/', auth, permit('super', 'adm'), async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// EDITAR: só super e adm
router.put('/:id', auth, permit('super', 'adm'), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// EXCLUIR: só super e adm
router.delete('/:id', auth, permit('super', 'adm'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produto removido com sucesso' });
});

export default router;