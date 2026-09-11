import path from 'path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'url';

import registerRoute from './register.js';
import mintRoute from './mint.js';
import verifyRoute from './verify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function route(app) {
    // Luồng Register: 
    // GET  /register     -> Render giao diện
    // POST /register/api -> Upload IPFS & Lưu DB PENDING
    app.use('/register', registerRoute);

    // Luồng Mint:
    // POST /mint/confirm -> Cập nhật DB MINTED
    app.use('/mint', mintRoute);

    app.get('/api/contract-info', async (req, res) => {
        try {
            const deployPath = path.resolve(__dirname, '../../deployments/localhost/ArtChain.json');
            const artifactPath = path.resolve(__dirname, '../../artifacts/contracts/ArtChain.sol/ArtChain.json');
            
            const deployData = JSON.parse(await readFile(deployPath, 'utf-8'));
            const artifactData = JSON.parse(await readFile(artifactPath, 'utf-8'));
            
            res.json({ 
                address: deployData.address,
                abi: artifactData.abi 
            });
        } catch (err) {
            console.error("Không thể đọc contract info:", err);
            res.status(500).json({ error: "Lỗi cấu hình contract" });
        }
    });

    app.use('/verify', verifyRoute);

    // Trang chủ
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    });

}

export default route;