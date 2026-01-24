import dotenv from 'dotenv';
import app from './src/app';
import { connectToMongoDatabase } from './src/config/mongo';
import { connectPostgreSQL } from './src/config/postgres';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectPostgreSQL();

connectToMongoDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


