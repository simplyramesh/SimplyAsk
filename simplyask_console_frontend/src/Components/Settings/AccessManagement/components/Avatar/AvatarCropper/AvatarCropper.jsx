import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';

import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex, StyledZoomSlider } from '../../../../../shared/styles/styled';
import { IMAGE_CROPPER_SHAPE } from '../../../../Components/FrontOffice/constants/common';

const createImage = (src) => {
  const image = new Image();

  image.src = src;

  return image;
};

const getCroppedImg = (sourceImage, cropAreaPx) => {
  const canvas = document.createElement('canvas');

  const sourceImg = createImage(sourceImage.img);

  const scaleX = sourceImg.naturalWidth / sourceImg.width;
  const scaleY = sourceImg.naturalHeight / sourceImg.height;

  canvas.width = cropAreaPx.width;
  canvas.height = cropAreaPx.height;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    sourceImg,
    cropAreaPx.x * scaleX,
    cropAreaPx.y * scaleY,
    cropAreaPx.width * scaleX,
    cropAreaPx.height * scaleY,
    0,
    0,
    cropAreaPx.width,
    cropAreaPx.height
  );

  return canvas.toDataURL();
};

const INITIAL_CROP = {
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedImage: null,
};

const AvatarCropper = ({ open, onClose, image, onApply, cropShape = IMAGE_CROPPER_SHAPE.round }) => {
  const [{ crop, zoom, croppedImage }, setCrop] = useState(INITIAL_CROP);

  useEffect(() => {
    if (open) {
      setCrop(INITIAL_CROP);
    }
  }, [open]);

  const handleApply = () => {
    onApply(croppedImage);
    onClose();
  };

  const originalAspectRatio = image?.aspectRatio ? image?.aspectRatio : 4 / 3;
  const targetAspectRatio = cropShape === IMAGE_CROPPER_SHAPE.round ? 1 : originalAspectRatio; // aspect ratio must be 1 for circle

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="500px"
      title="Edit Image"
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" gap="24px">
          <StyledButton variant="outlined" primary onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton variant="contained" primary onClick={handleApply}>
            Apply
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex p="24px 22px">
        <StyledFlex
          position="relative"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="400px"
          borderRadius="10px"
        >
          <Cropper
            image={image?.img}
            crop={crop}
            zoom={zoom}
            aspect={targetAspectRatio}
            cropShape={cropShape}
            restrictPosition={false}
            // showGrid={false} // unsure whether to include grid or not
            onCropChange={(c) => setCrop((prev) => ({ ...prev, crop: c }))}
            onZoomChange={(z) => setCrop((prev) => ({ ...prev, zoom: z }))}
            onCropComplete={(cropArea, cropAreaPx) =>
              setCrop((prev) => ({
                // cropArea isn't actually used, but may be useful when/if keeping the image centered while zooming and moving around and we have to calculate
                ...prev,
                croppedImage: getCroppedImg(image, cropAreaPx, cropArea),
              }))
            }
            style={{
              containerStyle: { borderRadius: '10px' },
              cropAreaStyle: { color: '#00000025' },
            }}
          />
        </StyledFlex>
        <StyledFlex mt="8px" px="18px">
          <StyledZoomSlider
            name="profile-image-zoom"
            value={zoom}
            min={0.25}
            max={10}
            step={0.05}
            aria-labelledby="Zoom"
            onChange={(e, z) => setCrop((prev) => ({ ...prev, zoom: z }))}
          />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default AvatarCropper;

AvatarCropper.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  image: PropTypes.shape({
    img: PropTypes.string,
    name: PropTypes.string,
  }),
  onApply: PropTypes.func,
  cropShape: PropTypes.string,
};
