import dotenv from 'dotenv';
import app from './src/app';
import { connectToMongoDatabase } from './src/config/mongo';
import { connectPostgreSQL } from './src/config/postgres';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectPostgreSQL();

    await connectToMongoDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

