import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const ArtworkSchema = new Schema(
  {
    certId: { type: String, required: true, unique: true },     
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    artist: { type: String, default: "Anonymous" },
    
    // Lưu trữ IPFS & Hash
    imageUrl: { type: String, required: true },                 // Link IPFS Gateway (để hiển thị)
    ipfsCid: { type: String, required: true },                  // Mã CID trên Pinata
    imageHash: { type: String, required: true, unique: true },   // SHA-256 Hash (bytes32 hex string)

    // Trạng thái On-Chain
    status: { 
      type: String, 
      enum: ["PENDING", "MINTED", "FAILED"], 
      default: "PENDING" 
    },
    ownerAddress: { type: String, required: false},               // Địa chỉ ví người sở hữu (Cập nhật sau khi Mint)
    transactionHash: { type: String, default: null },            // TxHash trên Blockchain (Cập nhật sau khi Mint)
    
    slug: { type: String, slug: "title", unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("Artwork", ArtworkSchema);