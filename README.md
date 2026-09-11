# ArtChain

**Blockchain-based digital artwork provenance**

ArtChain is a web application that creates a verifiable provenance record for digital artwork using SHA-256 hashing, IPFS, and blockchain.

## Features

* Upload artwork and metadata
* Generate a SHA-256 hash as the artwork's digital fingerprint
* Store artwork and metadata on IPFS via Pinata
* Register artwork provenance on a Solidity smart contract
* Connect to the blockchain using **MetaMask**
* Verify artwork records using **CertID**

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript, Tailwind CSS
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Blockchain:** Solidity, Hardhat
* **Web3:** ethers.js, MetaMask
* **Storage:** IPFS / Pinata
* **Hashing:** SHA-256

## Current Limitations

* Blockchain runs **only on a local Hardhat network**.
* Wallet connection currently supports **MetaMask only**.
* Artwork verification is currently available **only through CertID**.
* Image-based verification is **not implemented yet**.
* The system provides a provenance record; it does not establish legal copyright ownership.

## Basic Flow

```text
Upload Artwork
      ↓
SHA-256 Hash
      ↓
IPFS + MongoDB
      ↓
Smart Contract
      ↓
Local Hardhat Blockchain
      ↓
Verify by CertID
```

## Run Locally

```bash
npm install
npx hardhat node
npm start
```

Then open the application in your browser and connect MetaMask to the local Hardhat network.

## Project Status

**Prototype / Educational Project**
