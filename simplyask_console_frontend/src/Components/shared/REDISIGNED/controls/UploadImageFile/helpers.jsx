export const validateFileSize = (fileInput, maxFileSize) => {
  const maxSize = maxFileSize * 1024 * 1024;
  const file = fileInput.files[0];

  if (file && file.size > maxSize) return false;

  return true;
};

export const getFileImageInfo = async (file, cb) => {
  try {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    await new Promise((resolve, reject) => {
      reader.onloadend = resolve;
      reader.onerror = reject;
    });

    const newImg = new Image();
    newImg.src = reader.result;

    await new Promise((resolve) => {
      newImg.onload = resolve;
    });

    const aspectRatio = newImg.naturalWidth / newImg.naturalHeight;
    return {
      img: reader.result, name: file.name, aspectRatio, file,
    };
  } catch {
    return cb?.();
  }
};
