import { MultiDirectedGraph } from 'graphology';
import PropTypes from 'prop-types';
import React, { memo, useContext, useMemo } from 'react';
import { useDrop } from 'react-dnd';

import { getStringifiedEditorState } from '../../../../shared/REDISIGNED/controls/lexical/utils/helpers';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../shared/styles/styled';
import { useHistoricalRecoilState } from '../../../hooks/useHistoricalRecoilState';
import { canDropItem } from '../../../services/layout';
import { WorkflowEditorConfig } from '../../../WorkflowEditorConfig';
import diagramStyles from '../diagram.module.css';

const Slot = ({ onDrop, data }) => {
  const config = useContext(WorkflowEditorConfig);
  const { state } = useHistoricalRecoilState();

  const { workflow } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'regular',
    drop: onDrop,
    canDrop: (node) => !config.isReadOnly && canDropItem(graph, node, data),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const tooltipText = getStringifiedEditorState(data.condition);

  return (
    <section ref={drop} className={`${diagramStyles.Slot} ${data.isEnd && diagramStyles.End}`}>
      <section
        style={{
          bottom: '55%',
          left: '10px',
          whiteSpace: 'nowrap',
          position: 'absolute',
        }}
      >
        {data.title}{' '}
        <em style={{ position: 'absolute', bottom: '100%', left: '100%' }}>
          <StyledTooltip title={tooltipText} arrow placement="top" p="10px 15px" maxWidth="auto">
            <StyledFlex as="span">{tooltipText}</StyledFlex>
          </StyledTooltip>
        </em>{' '}
      </section>
      {!config.isReadOnly && <section className={`${diagramStyles.SlotPlus}`} />}

      <section className={`${diagramStyles.SlotArrow}`} />
      <section
        className={`${diagramStyles.SlotInner} ${canDrop && diagramStyles.Active} ${canDrop && isOver && diagramStyles.Hover}`}
      />
    </section>
  );
};

Slot.propTypes = {
  data: PropTypes.object,
  onDrop: PropTypes.func,
};

export default memo(Slot);
