// Note: fileToBase64 is in src/utils/helperFunctions.js
export const base64ToFile = async (base64, filename) => {
  const arr = base64?.split(',');

  const imgType = arr[0].match(/:(.*?);/)[1];

  const binaryString = atob(arr[1]);

  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], filename, { type: imgType });
};
