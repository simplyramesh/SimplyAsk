import styled from '@emotion/styled';
import ReactFlow from 'reactflow';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { media } from '../../../shared/styles/media';
import patternImg from '../../../../Assets/icons/pattern.svg';

export const StyledFlowEditor = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
export const StyledFlowEditorHead = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 55px;
  padding: 10px 36px;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  background: ${({ theme }) => theme.colors.white};
  z-index: 200;
`;

const StyledFlowEditorHeadControls = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% / 3);
  gap: 25px;

  ${media.xs} {
    width: auto;
    gap: 10px;
  }
`;

export const StyledFlowEditorHeadLeftControls = styled(StyledFlowEditorHeadControls)`
  justify-content: flex-start;
`;

export const StyledFlowEditorHeadCenterControls = styled(StyledFlowEditorHeadControls)`
  justify-content: center;
`;

export const StyledFlowEditorHeadRightControls = styled(StyledFlowEditorHeadControls)`
  justify-content: flex-end;
`;

export const StyledFlowEditorBody = styled('div', {
  shouldForwardProp: (prop) => !['pattern'].includes(prop),
})`
  position: relative;
  display: flex;
  height: 100%;
  overflow: hidden;
  background-image: ${({ pattern }) => pattern ? `url("${patternImg}")` : 'none'};
`;

export const StyledFlowEditorDiagram = styled(ReactFlow)`
  .react-flow__node {
    z-index: 99999 !important;
  }

  .react-flow__edge:hover path,
  .react-flow__edge.selected path {
    stroke: ${({ theme }) => theme.colors.secondary} !important;
  }
`;

export const StyledFlowEditorDroppable = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  flex-grow: 1;
`;

export const StyledFlowEditorDiagramWrap = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100%;
`;

export const StyledSvgIconWrap = styled('span', {
  shouldForwardProp: (prop) => !['width', 'height', 'themeFillColor', 'themeStrokeColor'].includes(prop),
})`
  display: flex;
  flex-shrink: 0;

  & > svg {
    width: ${({ width }) => width || '25px'} !important;
    height: ${({ height }) => height || '25px'} !important;

    & > path {
      fill: ${({ theme, themeFillColor }) => theme.colors[themeFillColor]};
      stroke: ${({ theme, themeStrokeColor }) => theme.colors[themeStrokeColor]};
    }
  }
`;
export const StyledZoomControl = styled(StyledButton, {
  shouldForwardProp: (prop) => !['active'].includes(prop),
})(({ theme, variant, active }) => ({
  ...(variant === 'text' && {
    padding: '7px 12px',
    backgroundColor: !active ? 'transparent' : theme.colors.tableEditableCellBg,
    borderColor: 'transparent',
    fontWeight: 400,
    lineHeight: '20px',
    fontSize: '16px',

    '& .MuiButton-endIcon': {
      marginLeft: '2px',
      fontSize: '24px',

      '& .MuiSvgIcon-fontSizeMedium': {
        fontSize: '24px',
      },
    },

    '&:hover': {
      backgroundColor: theme.colors.tableEditableCellBg,
    },
  }),
}));
