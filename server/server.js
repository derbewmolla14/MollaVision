import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { connectDatabase, isDatabaseReady } from './config/db.js';
import { databaseMiddleware } from './middleware/databaseMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  const healthy = isDatabaseReady();
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    message: healthy ? 'MollaVision API is running' : 'MollaVision API is running but MongoDB is unavailable',
    database: healthy ? 'connected' : 'disconnected',
  });
});
app.use('/api/auth', databaseMiddleware, authRoutes);
app.use('/api/courses', databaseMiddleware, courseRoutes);
app.use('/api/lessons', databaseMiddleware, lessonRoutes);
app.use('/api/progress', databaseMiddleware, progressRoutes);
app.use('/api/admin', databaseMiddleware, adminRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: 'Something went wrong on the server' });
});

app.listen(port, () => console.log(`MollaVision API running on port ${port}`));

connectDatabase().catch((error) => {
  console.error(`MongoDB connection failed: ${error.message}`);
});