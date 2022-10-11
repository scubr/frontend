import axios from 'axios';

export const uploadImage = async (file) => {

  // store the fileData in pinata ipfs api call
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(url, formData, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
    },
  });

  console.log(res.data);

  return res.data.IpfsHash;

};
