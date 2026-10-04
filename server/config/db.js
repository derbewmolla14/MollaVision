import mongoose from 'mongoose';

let databaseReady = false;

export const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  databaseReady = true;
  console.log('MongoDB connected successfully');
};

export const isDatabaseReady = () => databaseReady;