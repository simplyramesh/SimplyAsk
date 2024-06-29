import { theme } from '../../../../../config/theme';

const SIGNATURE_PLACEHOLDER = 'Draw Your Signature Here';

export const drawPlaceholder = (ref, hasUserInput) => {
  const canvas = ref.current.getCanvas();
  const ctx = canvas.getContext('2d');

  if (hasUserInput) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const placeholderWidth = ctx.measureText(SIGNATURE_PLACEHOLDER).width / 4; // 75% width to account for canvas width and 50% of width to center
  ctx.font = '15px Montserrat';
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.colors.information;
  ctx.fillText(SIGNATURE_PLACEHOLDER, (canvas.width - placeholderWidth) / 2, canvas.height / 2);
};
