import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDatabase } from '../config/db.js';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const serverEnvPath = path.join(serverDirectory, '..', '.env');
const rootEnvPath = path.join(serverDirectory, '..', '..', '.env');
dotenv.config({ path: fs.existsSync(serverEnvPath) ? serverEnvPath : rootEnvPath });

const seedAdmin = async () => {
  if (!process.env.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is not configured');
  await connectDatabase();
  const user = await User.findOneAndUpdate({ email: process.env.ADMIN_EMAIL.toLowerCase() }, { role: 'admin', status: 'active' }, { new: true });
  if (!user) throw new Error('No MongoDB user exists for ADMIN_EMAIL. Sign up with Clerk first, then run this command.');
  console.log(`Admin role assigned to ${user.email}`);
};

seedAdmin().catch((error) => { console.error(`Admin seed failed: ${error.message}`); process.exitCode = 1; }).finally(() => mongoose.connection.close());