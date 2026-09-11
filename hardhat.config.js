import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [
    hardhatToolboxMochaEthersPlugin,
    hardhatEthers 
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.20",
      },
    },
  },
  evmVersion: "paris",
  networks: {
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
  },
  
});