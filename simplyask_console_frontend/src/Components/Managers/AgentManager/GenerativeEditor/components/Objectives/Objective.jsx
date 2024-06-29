import React, { memo, useCallback } from 'react';
import { StyledFlex, StyledText, StyledTextareaAutosize } from '../../../../../shared/styles/styled';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { AddRounded, InfoOutlined } from '@mui/icons-material';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import Actions from './Actions/Actions';
import { actionDefaultTemplate } from '../../util/objective';
import ObjectiveAccordion from './ObjectiveAccordion/ObjectiveAccordion';
import { useSetRecoilState } from 'recoil';
import { generativeEditorActionOpened, generativeEditorObjectivesState } from '../../store';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { generateUUID } from '../../../../../Settings/AccessManagement/utils/helpers';

const Objective = ({ name, guidance, actions, objectiveIndex, designId }) => {
  const setObjectives = useSetRecoilState(generativeEditorObjectivesState);
  const setActionOpened = useSetRecoilState(generativeEditorActionOpened);

  const handleChangeGuidance = useCallback(
    (e) => setObjectives((prev) => setIn(prev, [objectiveIndex, 'guidance'], e.target.value)),
    []
  );

  const handleAddAction = useCallback(() => {
    const actionDesignId = generateUUID();

    setObjectives((prev) =>
      setIn(prev, [objectiveIndex, 'actions'], [...prev[objectiveIndex].actions, actionDefaultTemplate(actionDesignId)])
    );
    setActionOpened({
      actionDesignId,
      objectiveDesignId: designId,
    });
  }, [objectiveIndex, actions.length, designId]);

  return (
    <ObjectiveAccordion name={name} index={objectiveIndex}>
      <StyledFlex p="20px" gap="20px">
        <StyledFlex gap="10px">
          <StyledFlex direction="row" alignItems="center" gap="10px">
            <InputLabel label="Objective Guidance" name="persona" isRecommended size={15} weight={600} mb={0} lh={24} />
            <StyledTooltip arrow placement="top" title="Objective Guidance" p="10px 15px">
              <InfoOutlined fontSize="inherit" />
            </StyledTooltip>
          </StyledFlex>

          <StyledTextareaAutosize
            minRows={3}
            type="text"
            placeholder="Enter guidance..."
            value={guidance}
            onChange={handleChangeGuidance}
          />
        </StyledFlex>
        <StyledFlex direction="row" justifyContent="space-between" alignItems="center">
          <StyledFlex gap="10px" direction="row" alignItems="center">
            <InputLabel label="Possible Actions" isRecommended mb={0} />
            <StyledTooltip arrow placement="top" title="Possible Actions" p="10px 15px">
              <InfoOutlined fontSize="inherit" />
            </StyledTooltip>
          </StyledFlex>
          <StyledButton startIcon={<AddRounded />} variant="text" onClick={handleAddAction}>
            Add Action
          </StyledButton>
        </StyledFlex>
        <Actions actions={actions} objectiveIndex={objectiveIndex} objectiveDesignId={designId} />
        {actions.length === 0 && (
          <StyledFlex alignItems="center">
            <StyledText weight={500} textAlign="center">
              No Actions have been added yet
            </StyledText>
          </StyledFlex>
        )}
      </StyledFlex>
    </ObjectiveAccordion>
  );
};

export default memo(Objective);
