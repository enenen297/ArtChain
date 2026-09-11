import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';

import Artwork from '../models/Artwork.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
);

class RegisterController {
    // [GET] /register -> Trả về giao diện trang Register
    index(req, res) {
        res.sendFile(path.join(__dirname, '../views/register.html'));
    }

    // [POST] /api/register -> Xử lý upload ảnh, băm SHA-256 và push lên IPFS Pinata
    async processRegisterApi(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Vui lòng tải lên file ảnh tác phẩm.' });
            }

            const filePath = req.file.path;
            const { title, description, artist } = req.body;

            const fileBuffer = req.file.buffer;
            const fileName = req.file.originalname;

            // 1. Băm mã SHA-256
            const hashSHA256 = crypto
                .createHash('sha256')
                .update(fileBuffer)
                .digest('hex');

            const existingArtwork = await Artwork.findOne({ imageHash: hashSHA256 });
            if (existingArtwork) {
                // Xóa file tạm multer đã lưu
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

                return res.status(400).json({
                    success: false,
                    message: 'Tác phẩm này (Hash SHA-256) đã từng được đăng ký trên hệ thống!'
                });
            }

            // 2. Upload file lên Pinata IPFS
            const stream = Readable.from(fileBuffer);
            stream.path = fileName;

            const options = {
                pinataMetadata: { name: `ArtChain_${Date.now()}_${fileName}` },
                pinataOptions: { cidVersion: 0 }
            };

            const pinataResult = await pinata.pinFileToIPFS(stream, options);

            const certId = 'CERT-' + Date.now(); 

            const newArtwork = new Artwork({
                certId: certId,
                title: title || 'Untitled Artwork',
                description: description || '',
                artist: artist || 'Anonymous',
                imageUrl: `https://gateway.pinata.cloud/ipfs/${pinataResult.IpfsHash}`,
                ipfsCid: pinataResult.IpfsHash,
                imageHash: hashSHA256,
                status: 'PENDING' 
            });

            await newArtwork.save();

            // 3. Trả về JSON cho Frontend
            res.json({
                success: true,
                certId: certId,
                hashSHA256,
                ipfsCid: pinataResult.IpfsHash,
                ipfsGatewayUrl: `https://gateway.pinata.cloud/ipfs/${pinataResult.IpfsHash}`
            });
        } catch (error) {
            console.error('Lỗi chi tiết tại registerController:', error);

            // Xóa file tạm nếu xảy ra lỗi trong quá trình xử lý
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(500).json({
                success: false,
                message: 'Lỗi Server: ' + error.message
            });
        }   
    }
}

export default new RegisterController();