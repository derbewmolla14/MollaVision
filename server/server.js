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
import practiceRoutes from './routes/practiceRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([
  ...configuredOrigins,
  'http://localhost:5173',
  'http://localhost:3000',
])];
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MollaVision API is running',
    database: isDatabaseReady() ? 'connected' : 'disconnected',
  });
});
app.use('/api/auth', databaseMiddleware, authRoutes);
app.use('/api/courses', databaseMiddleware, courseRoutes);
app.use('/api/lessons', databaseMiddleware, lessonRoutes);
app.use('/api/progress', databaseMiddleware, progressRoutes);
app.use('/api/admin', databaseMiddleware, adminRoutes);
app.use('/api/practices', databaseMiddleware, practiceRoutes);
app.use('/api/chapters', databaseMiddleware, chapterRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: 'Something went wrong on the server' });
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`MollaVision API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exitCode = 1;
  }
};

startServer();