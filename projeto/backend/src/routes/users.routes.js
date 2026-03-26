import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { auth, permit } from '../middleware/auth.js';

const router = Router();

// LISTAR: todos podem ver
router.get('/', auth, permit('super', 'adm', 'user'), async (req, res) => {
    const users = (await User.find().select('-passwordHash')).sort({ createdAt: -1 });
    res.json(users);
});

// CRIAR: só o super e adm
router.post('/', auth, permit('super', 'adm'), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne ({ email });
        if(exists) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash,
            role
        });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch(error) {
        res.status(500).json({ message: 'Erro criar usuário', error: error.message });
    }
});

// EDITAR: só o super e adm
router.put('/:id', auth, permit('super', 'adm'), async (req, res) => {
    try {
        const { name, email, role, active, password } = req.body;

        const data = { name, email, role, active };

        if(password) {
            data.passwordHash = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, data, { new: true })
            .select('-passwordHash');
        res.json(user);
    } catch(error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
});

// EXCLUIR: só super e adm
router.delete('/:id', auth, permit('super', 'adm'), async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuário removido com sucesso' });
});

export default router;