import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

export default pinata;