// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArtChain - Digital Artwork Ownership & Provenance Verification
 */

contract ArtChain{

    struct Artwork {
        string certId;        // Mã định danh chứng nhận 
        bytes32 hashSHA256;   // 
        string ipfsCid;       // Content Identifier trên IPFS
        address owner;        // Địa chỉ ví người tạo / sở hữu tác phẩm
        uint256 timestamp;    // Thời gian đăng ký lên Blockchain
        bool isRegistered;    // Trạng thái tồn tại
    }

    // Mapping từ SHA-256 (bytes32) -> Artwork info
    mapping(bytes32 => Artwork) private _artworks;

    // Mapping từ certId -> SHA-256 (bytes32)
    mapping(string => bytes32) private _certIdToHash;

    // Event phát ra khi đăng ký tác phẩm thành công
    event ArtworkRegistered(
        string certId,
        bytes32 indexed hashSHA256,
        string ipfsCid,
        address indexed owner,
        uint256 timestamp
    );

    // Modifier kiểm tra tác phẩm chưa tồn tại
    modifier notRegistered(bytes32 hashSHA256) {
        require(!_artworks[hashSHA256].isRegistered, "Artwork already exists");
        _;
    }


    /**
     * @notice Đăng ký tác phẩm mới lên Blockchain
     */
    function registerArtwork(
        string memory certId,
        bytes32 hashSHA256,
        string memory ipfsCid
    ) external notRegistered(hashSHA256) {
        require(bytes(certId).length > 0, "Cert ID empty");
        require(hashSHA256 != bytes32(0), "SHA-256 empty");
        require(bytes(ipfsCid).length > 0, "IPFS CID empty");
        
        // CHỐNG GHI ĐÈ CERT ID: Kiểm tra certId chưa từng được gán cho hash nào
        require(_certIdToHash[certId] == bytes32(0), "Cert ID already exists");

        _artworks[hashSHA256] = Artwork({
            certId: certId,
            hashSHA256: hashSHA256,
            ipfsCid: ipfsCid,
            owner: msg.sender,
            timestamp: block.timestamp,
            isRegistered: true
        });

        _certIdToHash[certId] = hashSHA256;

        emit ArtworkRegistered(certId, hashSHA256, ipfsCid, msg.sender, block.timestamp);
    }

    /**
     * @notice Tra cứu thông tin tác phẩm theo SHA-256 (bytes32)
     */
    function verifyArtwork(bytes32 hashSHA256) external view returns (Artwork memory) {
        require(_artworks[hashSHA256].isRegistered, "Artwork not found");
        return _artworks[hashSHA256];
    }

    /**
     * @notice Tra cứu thông tin tác phẩm theo Cert ID
     */
    function getArtworkByCertId(string memory certId) external view returns (Artwork memory) {
        bytes32 hashSHA256 = _certIdToHash[certId];
        require(hashSHA256 != bytes32(0), "Cert ID invalid");
        return _artworks[hashSHA256];
    }

    /**
     * @notice Kiểm tra nhanh xem tác phẩm đã đăng ký chưa
     */
    function isArtworkRegistered(bytes32 hashSHA256) external view returns (bool) {
        return _artworks[hashSHA256].isRegistered;
    }
}