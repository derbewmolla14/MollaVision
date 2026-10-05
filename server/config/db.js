import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let databaseReady = false;

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const serverEnvPath = path.join(serverDirectory, '..', '.env');
const rootEnvPath = path.join(serverDirectory, '..', '..', '.env');
dotenv.config({ path: fs.existsSync(serverEnvPath) ? serverEnvPath : rootEnvPath });

export const connectDatabase = async () => {
  const configuredUri = process.env.MONGODB_URI?.trim();
  console.log(`MONGODB_URI configured: ${configuredUri ? 'yes' : 'no'}`);

  if (!configuredUri) {
    throw new Error('MONGODB_URI is missing. Set it in the server environment before starting MollaVision.');
  }

  const isLocalMongoUri = /^mongodb(?:\+srv)?:\/\/(?:[^@/]+@)?(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(configuredUri);
  const localMongoEnabled = process.env.NODE_ENV === 'development'
    && process.env.ALLOW_LOCAL_MONGODB === 'true';
  if (isLocalMongoUri && !localMongoEnabled) {
    throw new Error('Local MongoDB is disabled. Use MongoDB Atlas or set ALLOW_LOCAL_MONGODB=true in development.');
  }

  await mongoose.connect(configuredUri);
  databaseReady = true;
  console.log('MongoDB connected successfully');
};

export const isDatabaseReady = () => databaseReady;
