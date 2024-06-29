import { MultiDirectedGraph } from 'graphology';
import React, { useMemo } from 'react';

import { StyledText } from '../../../../shared/styles/styled';
import EndProcessIcon from '../../../Assets/Icons/endProcess.svg?component';
import { stepTypes } from '../../../constants/graph';
import { useHistoricalRecoilState } from '../../../hooks/useHistoricalRecoilState';
import { getStepIdName, updateNode } from '../../../services/graph';
import {
  StyledEndProcessHead,
  StyledEndProcessIcon,
  StyledEndProcessInfo,
  StyleEdnProcessTitle,
  StyleEndProcessArrow,
} from './StyledEndProcessInfo';

const EndProcessInfo = () => {
  const { past, future, state, setWithoutHistory } = useHistoricalRecoilState();

  const { workflow } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  const endProcessNodes = graph.filterNodes((_, attrs) => attrs.stepType === stepTypes.END_PROCESSING);

  const mappedNodes = endProcessNodes.map((node) => graph.getNodeAttributes(node));
  const setHighlight = (isHighlighted) => {
    endProcessNodes.forEach((node) => {
      updateNode(graph, node, { isHighlighted });
    });

    setWithoutHistory({
      past,
      future,
      present: {
        ...state,
        workflow: graph.export(),
      },
    });
  };

  if (!endProcessNodes?.length) return null;

  return (
    <StyledEndProcessInfo onMouseEnter={() => setHighlight(true)} onMouseLeave={() => setHighlight(false)}>
      <StyledEndProcessHead direction="row" gap="10px" alignItems="center">
        <StyledEndProcessIcon>
          <EndProcessIcon />
        </StyledEndProcessIcon>
        <StyleEdnProcessTitle>
          <StyledText weight={600} size={15} lh={20} textAlign="center">
            End Process Steps
          </StyledText>
        </StyleEdnProcessTitle>
      </StyledEndProcessHead>
      <div>
        {mappedNodes.map((node, index) => (
          <div>
            <StyledText weight={400} size={11} lh={16} display="inline">
              {index + 1}
              {'. '}
            </StyledText>

            <StyledText weight={600} size={11} lh={16} display="inline">
              {node.displayName}
            </StyledText>
            <StyledText weight={400} size={11} lh={16} display="inline" color="#2075F5">
              {' - '}
              {getStepIdName(node.stepId)}
            </StyledText>
          </div>
        ))}
      </div>
      <StyleEndProcessArrow />
    </StyledEndProcessInfo>
  );
};

export default EndProcessInfo;
