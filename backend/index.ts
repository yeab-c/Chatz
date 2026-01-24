import dotenv from 'dotenv';
import app from './src/app';
import { connectToMongoDatabase } from './src/config/mongo';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectToMongoDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
