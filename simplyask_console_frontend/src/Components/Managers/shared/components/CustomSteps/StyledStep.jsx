import styled from '@emotion/styled';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Handle } from 'reactflow';

import ErrorCircle from '../../../../../Assets/icons/agent/steps/circleErrorAlarm.svg?component';
import { EXECUTIONS_STATUSES } from '../../../OrchestrationManager/ProcessOrchestratorDetails/constants/initialValues';
import { MODES } from '../../constants/processOrchesEditor';

export const StyledStepSourceHandle = styled(Handle, {
  shouldForwardProp: (prop) => !['touchedId', 'transition'].includes(prop),
})`
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  background: ${({ theme }) => theme.colors.galleryGray} !important;
  border: 3px solid ${({ theme, id, touchedId }) => (id === touchedId ? theme.colors.secondary : theme.colors.primary)} !important;
  left: ${({ transition }) => (transition ? 'calc(100% + 9px)' : 'calc(100% - 7px)')} !important;
  bottom: auto !important;

  &:hover {
    border-color: #f57b20 !important;
    background-color: #fde5d2 !important;
  }
`;

export const StyledStepTargetHandle = styled(Handle, {
  shouldForwardProp: (prop) => prop !== 'active',
})`
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  width: 100% !important;
  height: 100% !important;
  transform: none !important;
  border-radius: 0 !important;
  pointer-events: ${({ active }) => (active ? 'all' : 'none')} !important;
  opacity: 0;
`;

export const StyledDefaultStep = styled.div`
  position: relative;
  width: 330px;
`;

export const StyledSmallStep = styled.div`
  height: 52px;
  padding: 0 21px 0 15px;
`;

export const StyledDefaultStepHead = styled('div', {
  shouldForwardProp: (prop) => !['background'].includes(prop),
})`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 7px 7px 0 0;
  padding: 7px;
  background: ${({ theme, background }) => theme.colors[background] || theme.colors.iconBgBlue} !important;
`;

export const StyledDefaultStepHeadLabel = styled('div', {
  shouldForwardProp: (prop) => !['backgroundHover', 'editingDisabled'].includes(prop),
})`
  display: inline-flex;
  padding: 8px;
  border-radius: 5px;
  transition: background 0.3s ease;
  pointer-events: ${({ editingDisabled }) => (editingDisabled ? 'none' : 'all')};
  flex-grow: 1;
  min-height: 32px;

  &:hover {
    cursor: text;
    background: ${({ theme, backgroundHover }) => theme.colors[backgroundHover] || theme.colors.iconBgHover} !important;
  }
`;

export const StyledDefaultStepHeadArea = styled(TextareaAutosize, {
  shouldForwardProp: (prop) => !['backgroundHover'].includes(prop),
})`
  flex: 1 0;
  padding: 7px 7px 5px;
  border: 1px solid ${({ theme, backgroundHover }) => theme.colors[backgroundHover] || theme.colors.lavenderHover} !important;
  border-radius: 5px;
  background: transparent;
  resize: none;
  appearance: none;
  outline: none !important;
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
`;

export const StyledDefaultStepHeadIcon = styled('div', {
  shouldForwardProp: (prop) => !['backgroundHover', 'p', 'ml'].includes(prop),
})`
  position: relative;
  margin-left: ${({ ml }) => ml || 'auto'};
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  padding: ${({ p }) => p || '6px 0 2px'};

  &:hover {
    background: ${({ theme, backgroundHover }) => theme.colors[backgroundHover] || theme.colors.iconBgHover} !important;
  }
`;

export const StyledDefaultStepBody = styled('div', {
  shouldForwardProp: (prop) => !['p'].includes(prop),
})`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${({ p }) => p || '15px'};
  gap: 15px;
`;

export const StyledStep = styled('div', {
  shouldForwardProp: (prop) => !['hovered', 'selected', 'status', 'mode'].includes(prop),
})`
  position: relative;
  box-shadow: ${({ theme, hovered, selected }) => theme.boxShadows[hovered || selected ? 'boxHovered' : 'box']};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  transition: box-shadow 0.3s ease;

  ${({ mode }) =>
    mode === MODES?.HISTORY &&
    `
    border: 3px solid #000;
    
    ${StyledDefaultStepHead} {
     background: #E6E6E6 !important;
    }
    
    ${StyledDefaultStepHeadIcon}:hover, ${StyledDefaultStepHeadLabel}:hover {
      background: #CCC !important;
    }
  `}

  ${({ status }) =>
    status === EXECUTIONS_STATUSES.SUCCESS &&
    `
    border: 3px solid #28A826;
    
    ${StyledDefaultStepHead} {
      background: #C9E9C9 !important;
    }
    
    ${StyledDefaultStepHeadIcon}:hover, ${StyledDefaultStepHeadLabel}:hover {
      background: #A2D7A2 !important;
    }
  `}

  ${({ status }) =>
    status === EXECUTIONS_STATUSES.FAILED &&
    `
    border: 3px solid #E03B24;
    
    ${StyledDefaultStepHead} {
      background: #F7CEC8 !important;
    }
    
    ${StyledDefaultStepHeadIcon}:hover, ${StyledDefaultStepHeadLabel}:hover {
      background: #F4ABA0 !important;
    }
  `}

  ${({ status }) =>
    status === EXECUTIONS_STATUSES.CANCELLED &&
    `
    border: 3px solid #2D3A47;
    
    ${StyledDefaultStepHead} {
      background: #D1DDE8 !important;
    }
    
    ${StyledDefaultStepHeadIcon}:hover, ${StyledDefaultStepHeadLabel}:hover {
      background: #AABFD2 !important;
    }
  `}

  ${({ status }) =>
    [EXECUTIONS_STATUSES.EXECUTING, EXECUTIONS_STATUSES.SCHEDULED].includes(status) &&
    `
    border: 3px solid #E7BB09;
    
    ${StyledDefaultStepHead} {
      background: #F9EEC1 !important;
    }
    
    ${StyledDefaultStepHeadIcon}:hover, ${StyledDefaultStepHeadLabel}:hover {
      background: #E7BB09 !important;
    }
  `}
`;

export const StyledStepErrorCircle = styled(ErrorCircle, {
  shouldForwardProp: (prop) => !['inline'].includes(prop),
})`
  ${({ inline }) =>
    !inline &&
    `
    position: absolute;
    top: 10px;
    right: 15px;
  `}
`;

export const StyledStepDropZone = styled('section', {
  shouldForwardProp: (prop) => !['canDrop', 'fullWidth'].includes(prop),
})`
  display: ${({ canDrop }) => (canDrop ? 'block' : 'none')};
  position: relative;
  border-radius: 2px;
  width: 100%;
  padding: ${({ fullWidth }) => (fullWidth ? '0' : '0 0 10px 0')};

  &:after {
    content: '';
    position: absolute;
    left: ${({ fullWidth }) => (fullWidth ? '0' : '10px')};
    top: 0;
    height: 4px;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'calc(100% - 20px)')};
    border-radius: 2px;
    background-color: #4299ff;
  }
`;

export const StyledStepGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #dadfe8;
  background: white;

  &:empty {
    display: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const StyledStepGroupItem = styled('div', {
  shouldForwardProp: (prop) => !['hovered', 'opacity', 'selected'].includes(prop),
})`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
  height: 45px;
  border-bottom: 1px solid #dadfe8;
  box-shadow: ${({ selected }) => (selected ? '0 0 0 2px #4299FF' : 'none')};
  z-index: ${({ hovered }) => (hovered ? 1 : 0)};
  opacity: ${({ opacity }) => opacity};
`;

export const StyledStepGroupItemWrap = styled('div', {
  shouldForwardProp: (prop) => !['hovered', 'opacity', 'selected'].includes(prop),
})`
  position: relative;

  &:first-of-type ${StyledStepGroupItem} {
    border-radius: 10px 10px 0 0;
  }

  &:last-of-type ${StyledStepGroupItem} {
    border-radius: 0 0 10px 10px;
    border-bottom: none;
  }

  &:only-of-type ${StyledStepGroupItem} {
    border-radius: 10px;
  }
`;

export const StyledStepGroupItemIcon = styled.div`
  display: flex;
  flex-shrink: 0;

  svg {
    width: 25px;
    height: 25px;
  }
`;
