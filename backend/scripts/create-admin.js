import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { query } from '../src/db.js';

dotenv.config();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL a ADMIN_PASSWORD musí být nastavené v prostředí.');
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email, passwordHash],
    );
    console.log(`Admin účet ${email} připraven.`);
  } catch (error) {
    console.error('Nepodařilo se vytvořit admin účet', error);
    process.exitCode = 1;
  }
}

createAdmin();
