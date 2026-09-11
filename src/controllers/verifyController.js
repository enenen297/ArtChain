import path from 'path';
import { fileURLToPath } from 'url';
import Artwork from '../models/Artwork.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VerifyController {
    // [GET] /verify -> Giao diện trang Verify
    index(req, res) {
        res.sendFile(path.join(__dirname, '../views/verify.html'));
    }

    // [POST] /verify/api -> Kiểm tra CertID + Trạng thái Minted
    async processVerifyApi(req, res, next) {
        try {
            const { certId, query } = req.body;
            const searchCertId = (certId || query || '').trim();

            if (!searchCertId) {
                return res.status(400).json({ 
                    success: false,
                    authentic: false, 
                    message: 'Vui lòng nhập mã CertID để tra cứu tác phẩm.' 
                });
            }

            // Tìm tác phẩm trong MongoDB theo certId
            const artwork = await Artwork.findOne({ certId: searchCertId });

            // Điều kiện AUTHENTIC: Phải tìm thấy bản ghi VÀ status phải là 'minted'
            const isMinted = artwork && artwork.status && artwork.status.toLowerCase() === 'minted';

            if (!isMinted) {
                let failMessage = 'Mã CertID không tồn tại trên hệ thống.';
                if (artwork) {
                    failMessage = `No registration record was found for this ID.`;
                }

                return res.json({ 
                    success: true,
                    authentic: false,
                    message: failMessage
                });
            }

            return res.json({
                success: true,
                authentic: true,
                message: 'Tác phẩm hợp lệ và đã được mint thành công.',
                data: {
                    title: artwork.title,
                    certId: artwork.certId,
                    artist: artwork.artist || 'N/A',
                    ownerAddress: artwork.ownerAddress || artwork.owner || 'N/A',
                    hashSHA256: artwork.imageHash,
                    ipfsCid: artwork.ipfsCid,
                    ipfsGatewayUrl: artwork.imageUrl || `https://gateway.pinata.cloud/ipfs/${artwork.ipfsCid}`,
                    status: artwork.status
                }
            });

        } catch (error) {
            console.error('Lỗi chi tiết tại verifyController:', error);
            return res.status(500).json({ 
                success: false,
                authentic: false, 
                message: 'Lỗi Server: ' + error.message 
            });
        }
    }
}

export default new VerifyController();