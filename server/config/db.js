import mongoose from 'mongoose';

let databaseReady = false;

const connectWithUri = async (uri, timeoutMs = 5000) => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: timeoutMs });
};

export const connectDatabase = async () => {
  const configuredUri = process.env.MONGODB_URI;
  if (!configuredUri) {
    throw new Error('MONGODB_URI is not configured. Add it to server/.env');
  }

  try {
    await connectWithUri(configuredUri);
    databaseReady = true;
    console.log('MongoDB connected successfully');
    return;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MongoDB connection failed. Check MONGODB_URI and that MongoDB is running.');
  }

  try {
    console.error('Local MongoDB is not reachable. Starting an in-memory MongoDB instance for development.');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create({
      instance: { launchTimeout: 120000 },
    });
    await connectWithUri(memoryServer.getUri(), 20000);
    databaseReady = true;
    console.log('In-memory MongoDB connected successfully (development fallback; data does not persist)');
  } catch (memoryError) {
    console.error(`MongoDB connection failed: ${memoryError.message}`);
    throw memoryError;
  }
};

export const isDatabaseReady = () => databaseReady;
