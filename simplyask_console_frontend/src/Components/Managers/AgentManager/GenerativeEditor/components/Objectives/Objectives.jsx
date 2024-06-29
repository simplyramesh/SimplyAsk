import AddIcon from '@mui/icons-material/Add';
import React, { memo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useRecoilState, useSetRecoilState } from 'recoil';
import AvoidTopicsIcon from '../../../../../../Assets/icons/agent/generativeAgent/objectives.svg?component';
import { generateUUID } from '../../../../../Settings/AccessManagement/utils/helpers';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { StyledGenerativeEditorCard } from '../../StyledGenerativeEditor';
import {
  generativeEditorActionDragging,
  generativeEditorActionOpened,
  generativeEditorObjectivesState,
} from '../../store';
import { objectiveDefaultTemplate } from '../../util/objective';
import GenerativeEditorCardsHeader from '../GenerativeEditorCardsHeader/GenerativeEditorCardsHeader';
import Objective from './Objective';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const Objectives = () => {
  const [objectives, setObjectives] = useRecoilState(generativeEditorObjectivesState);
  const setActionDragging = useSetRecoilState(generativeEditorActionDragging);
  const [actionOpened, setActionOpened] = useRecoilState(generativeEditorActionOpened);

  const handleAdd = () => {
    setObjectives([...objectives, objectiveDefaultTemplate(generateUUID())]);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    setActionDragging(null);

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const sourceIndex = objectives.findIndex((obj) => obj.designId === source.droppableId);
      const items = reorder(objectives[sourceIndex].actions, source.index, destination.index);

      setObjectives((prev) => setIn(prev, [sourceIndex, 'actions'], items));
    } else {
      const sourceIndex = objectives.findIndex((obj) => obj.designId === source.droppableId);
      const destinationIndex = objectives.findIndex((obj) => obj.designId === destination.droppableId);

      const result = move(objectives[sourceIndex]?.actions, objectives[destinationIndex]?.actions, source, destination);
      const actionDesignId = result[destination.droppableId][destination.index].designId;

      setObjectives((prev) => setIn(prev, [sourceIndex, 'actions'], result[source.droppableId]));
      setObjectives((prev) => setIn(prev, [destinationIndex, 'actions'], result[destination.droppableId]));

      // update id of opened action if it was moved
      if (actionOpened?.actionDesignId === actionDesignId) {
        setActionOpened({
          actionDesignId,
          objectiveDesignId: destination.droppableId,
        });
      }
    }
  };

  const handleDragStart = (event) => {
    setActionDragging(event.source);
  };

  return (
    <StyledGenerativeEditorCard borderColor="secondary" id="objectives">
      <StyledFlex gap="30px">
        <GenerativeEditorCardsHeader
          icon={<AvoidTopicsIcon />}
          title="Objectives"
          description="Configure the Agent’s possible conversation objectives and actions it can perform for each one"
          actions={
            <StyledFlex flexShrink="0">
              <StyledButton variant="contained" tertiary onClick={handleAdd} startIcon={<AddIcon />}>
                Add Objective
              </StyledButton>
            </StyledFlex>
          }
        />

        <StyledFlex gap="20px">
          <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            {objectives.map((objective, index) => (
              <Objective key={objective.designId} objectiveIndex={index} {...objective} />
            ))}
          </DragDropContext>
        </StyledFlex>
      </StyledFlex>
    </StyledGenerativeEditorCard>
  );
};

export default memo(Objectives);
