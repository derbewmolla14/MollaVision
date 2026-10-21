import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let databaseReady = false;

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const serverEnvPath = path.join(serverDirectory, '..', '.env');
const rootEnvPath = path.join(serverDirectory, '..', '..', '.env');
const environmentPath = fs.existsSync(serverEnvPath) ? serverEnvPath : rootEnvPath;
dotenv.config({ path: environmentPath });

const getMongoTarget = (uri) => {
  const match = uri.match(/^mongodb(\+srv)?:\/\/(?:[^@/]+@)?([^/:?]+)(?::(\d+))?/i);
  if (!match) {
    return null;
  }

  return {
    scheme: match[1] ? 'mongodb+srv' : 'mongodb',
    host: match[2],
    port: match[3] || (match[1] ? 'SRV' : '27017'),
  };
};

export const connectDatabase = async () => {
  const configuredUri = process.env.MONGODB_URI?.trim();
  console.log(`MONGODB_URI configured: ${configuredUri ? 'yes' : 'no'}`);

  if (!configuredUri) {
    throw new Error('MONGODB_URI is missing. Set it in the server environment before starting MollaVision.');
  }

  const mongoTarget = getMongoTarget(configuredUri);
  if (!mongoTarget) {
    throw new Error('MONGODB_URI is not a valid MongoDB URI. Use mongodb:// for a local server or mongodb+srv:// from Atlas Connect > Drivers.');
  }

  const isLocalMongoUri = /^mongodb(?:\+srv)?:\/\/(?:[^@/]+@)?(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(configuredUri);
  const localMongoEnabled = process.env.NODE_ENV === 'development'
    && process.env.ALLOW_LOCAL_MONGODB === 'true';
  if (isLocalMongoUri && !localMongoEnabled) {
    throw new Error('Local MongoDB is disabled. Use MongoDB Atlas or set ALLOW_LOCAL_MONGODB=true in development.');
  }

  console.log(`MongoDB target: ${mongoTarget.scheme}://${mongoTarget.host}:${mongoTarget.port}`);

  try {
    await mongoose.connect(configuredUri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    databaseReady = true;
    console.log(`MongoDB connected successfully using ${path.relative(process.cwd(), environmentPath)}`);
  } catch (error) {
    const code = error?.code;
    const errorName = error?.name;
    const endpoint = error?.address
      ? ` ${error.address}${error.port ? `:${error.port}` : ''}`
      : '';
    const isNetworkError = code === 'ETIMEDOUT'
      || code === 'ECONNREFUSED'
      || errorName === 'MongooseServerSelectionError'
      || errorName === 'MongoServerSelectionError';
    const networkHint = isNetworkError
      ? ' Check Atlas Network Access, the current public IP allowlist, DNS, firewall, and outbound TCP access to MongoDB.'
      : ' Check the Atlas database user credentials and the connection string copied from Atlas Connect > Drivers.';
    const failureType = code || errorName;
    throw new Error(`Unable to connect to MongoDB${endpoint}${failureType ? ` (${failureType})` : ''}.${networkHint}`, { cause: error });
  }
};

export const isDatabaseReady = () => databaseReady;
