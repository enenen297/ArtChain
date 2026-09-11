import Artwork from '../models/Artwork.js';

class MintController {
    // [POST] /mint/confirm -> Cập nhật trạng thái sau khi MetaMask ký & mint thành công
    async confirmMint(req, res) {
        try {
            const { certId, imageHash, ownerAddress, transactionHash } = req.body;

            if ((!certId && !imageHash) || !ownerAddress || !transactionHash) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu dữ liệu: Cần (certId hoặc imageHash), ownerAddress, và transactionHash.'
                });
            }

            const searchQuery = certId ? { certId } : { imageHash };

            //Cập nhật bản ghi từ PENDING -> MINTED trong DB
            const updatedArtwork = await Artwork.findOneAndUpdate(
                searchQuery,
                {
                    $set: {
                        status: 'MINTED',
                        ownerAddress: ownerAddress.toLowerCase(), // Chuẩn hóa địa chỉ ví dạng chữ thường
                        transactionHash: transactionHash
                    }
                },
                { new: true, runValidators: true }
            );

            //Kiểm tra xem tác phẩm có tồn tại không
            if (!updatedArtwork) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy tác phẩm phù hợp trong cơ sở dữ liệu.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cập nhật trạng thái Mint thành công!',
                data: updatedArtwork
            });

        } catch (error) {
            console.error('Lỗi tại MintController.confirmMint:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi Server: ' + error.message
            });
        }
    }

    // [POST] /mint/fail -> Cập nhật trạng thái nếu người dùng hủy hoặc giao dịch thất bại
    async failMint(req, res) {
        try {
            const { certId, imageHash } = req.body;
            const searchQuery = certId ? { certId } : { imageHash };

            const updatedArtwork = await Artwork.findOneAndUpdate(
                searchQuery,
                { $set: { status: 'FAILED' } },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: 'Đã ghi nhận trạng thái Mint thất bại.',
                data: updatedArtwork
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi Server: ' + error.message
            });
        }
    }
}

export default new MintController();