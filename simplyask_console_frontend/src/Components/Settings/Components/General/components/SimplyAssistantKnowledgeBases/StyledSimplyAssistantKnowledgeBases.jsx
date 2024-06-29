import styled from '@emotion/styled';
import { StyledZoomSlider } from '../../../../../shared/styles/styled';
import { StyledRowHoverActionCellIconWrapper } from '../../../../../shared/styles/styled';

export const StyledKnowledgeBaseSlider = styled(StyledZoomSlider)(({ theme }) => ({
  height: '4px',
  '& .MuiSlider-rail': {
    backgroundColor: theme.colors.lightCyanBlue,
    border: `2px solid ${theme.colors.lightCyanBlue}50`,
    opacity: 1,
  },
  '& .MuiSlider-thumb': {
    width: '20px',
    height: '20px',
    backgroundColor: theme.colors.secondary,
    transition: 'background-color 250ms ease-in-out, border 250ms ease-in-out',
    '&:hover': {
      border: `2px solid ${theme.colors.secondary}`,
      boxShadow: theme.boxShadows.sliderThumb,
    },
  },
}));

export const StyledRelativeRowHoverActionCellIconWrapper = styled(StyledRowHoverActionCellIconWrapper)`
  position: relative;
`;