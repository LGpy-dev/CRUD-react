import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

async function seed() {
  await connectDB();

  const exists = await User.findOne({ email: process.env.SUPER_EMAIL });
  if (exists) {
    console.log('Super usuário já existe');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(process.env.SUPER_PASSWORD, 10);

  await User.create({
    name: process.env.SUPER_NAME,
    email: process.env.SUPER_EMAIL,
    passwordHash,
    role: 'super'
  });

  console.log('Super usuário criado com sucesso');
  process.exit(0);
}

seed();