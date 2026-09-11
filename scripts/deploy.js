import hre from "hardhat";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Đang tiến hành deploy contract ArtChain...");

  const { ethers } = await hre.network.connect(); 

  const ArtChain = await ethers.getContractFactory("ArtChain");
  const artChain = await ArtChain.deploy();

  await artChain.waitForDeployment();

  const contractAddress = await artChain.getAddress();
  console.log("Contract ArtChain đã được deploy tại địa chỉ:", contractAddress);

  const deployDir = path.join(__dirname, "../deployments/localhost");
  if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir, { recursive: true });
  }

  const deployData = {
        address: contractAddress,
        network: "localhost",
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(deployDir, "ArtChain.json"),
        JSON.stringify(deployData, null, 2)
    );
    console.log(`Saved deployment info to: ${path.join(deployDir, "ArtChain.json")}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});