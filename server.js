import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import pinataSDK from '@pinata/sdk';

import db from './src/config/db/index.js';
import route from './src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

db.connect();

// Middleware xử lý dữ liệu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves static files
app.use('/artifacts', express.static(path.join(__dirname, 'artifacts'))); 
app.use('/deployments', express.static(path.join(__dirname, 'deployments')));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/views', express.static(path.join(__dirname, 'src/views')));

route(app);

// Check pinata connection
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);
pinata.testAuthentication().then((result) => {
    console.log("Pinata successfully connected!");
}).catch((err) => {
    console.log("Pinata connection failed:", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
