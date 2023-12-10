import mongoose from 'mongoose';
import debug from 'debug';
const debugDB = debug('app:DB');

const mongoDatabase = () =>
  mongoose
    .connect(process.env.DB_URL)
    .then(() => debugDB('Connected to MongoDB 🤝🤝🤝'))
    .catch(() => debugDB("Couldn't connect to MongoDB 😡😡😡"));

export default mongoDatabase;
