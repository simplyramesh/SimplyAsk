import React, { memo } from 'react';
import { Position } from 'reactflow';
import { StyledSmallStep, StyledStep, StyledStepSourceHandle } from '../StyledStep';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import StartIcon from '../../../../../../Assets/icons/agent/steps/start.svg?component';

const StartStep = memo(({ selected, data, isConnectable }) => {
  const startHandleId = 'start';

  return (
    <StyledStep hovered={data.meta?.hovered} selected={selected}>
      <StyledSmallStep>
        <StyledFlex direction="row" alignItems="center" gap="12px" height="100%">
          <StartIcon />
          <StyledText color="#28A826" size={16} weight={600}>
            {data.label}
          </StyledText>
        </StyledFlex>

        <StyledStepSourceHandle
          id={startHandleId}
          type="source"
          touchedId={data.meta?.touched?.handleId}
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </StyledSmallStep>
    </StyledStep>
  );
});

export default StartStep;
