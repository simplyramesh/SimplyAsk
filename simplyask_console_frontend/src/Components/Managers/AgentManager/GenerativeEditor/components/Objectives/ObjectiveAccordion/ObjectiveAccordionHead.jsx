import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { memo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { generateUUID } from '../../../../../../Settings/AccessManagement/utils/helpers';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import DefaultStepHeadView from '../../../../../shared/components/CustomSteps/DefaultStepHeadView/DefaultStepHeadView';
import {
  StyledDefaultStepHeadIcon,
  StyledStepErrorCircle,
} from '../../../../../shared/components/CustomSteps/StyledStep';
import { DUPLICATE_NAME_COPY } from '../../../constants/core';
import { getUniqueNameRecursively } from '../../../formmaters';
import { generativeEditorErrors, generativeEditorObjectivesState } from '../../../store';
import HeadContextMenu from '../HeadContextMenu';

const ObjectiveAccordionHead = ({ expanded, name, index, setExpanded }) => {
  const [objectives, setObjectives] = useRecoilState(generativeEditorObjectivesState);
  const [editing, setEditing] = useState(false);
  const errors = useRecoilValue(generativeEditorErrors);

  const errorsPath = `objectives[${index}]`;
  const hasErrors = Object.keys(errors).filter((key) => key.includes(errorsPath)).length > 0;

  const handleDelete = () => {
    if (objectives.length > 1) {
      const newObjectives = objectives.filter((_, i) => i !== index);
      setObjectives(newObjectives);
    }
  };

  const handleDuplicate = () => {
    const newObjectives = [...objectives];
    const newDuplicatedName = objectives[index].name;
    let getUniqueName = '';

    if (newDuplicatedName.length > 0) {
      if (newDuplicatedName?.includes(DUPLICATE_NAME_COPY)) {
        const removeCopyString = name.split(DUPLICATE_NAME_COPY)[0];
        getUniqueName = getUniqueNameRecursively(removeCopyString, newObjectives);
      } else {
        getUniqueName = getUniqueNameRecursively(newDuplicatedName, newObjectives);
      }
    }

    const duplicatedObjective = {
      ...objectives[index],
      name: getUniqueName,
      designId: generateUUID(),
      actions: objectives[index].actions.map((action) => ({
        ...action,
        designId: generateUUID(),
      })),
    };

    newObjectives.splice(index + 1, 0, duplicatedObjective);

    setObjectives(newObjectives);
  };

  const handleLabelChange = (e) => {
    e.stopPropagation();

    setObjectives((prev) => setIn(prev, [index, 'name'], e.target.value));
  };

  const handleExitFromEdit = (e) => {
    e.stopPropagation();

    setEditing(false);
  };

  const handleKeyPress = (e) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      handleExitFromEdit(e);
    }
  };

  const handleFocus = (e) => {
    e.stopPropagation();

    const val = e.target.value;
    e.target.value = '';
    e.target.value = val;
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  return (
    <DefaultStepHeadView
      label={name}
      editing={editing}
      onChange={handleLabelChange}
      onBlur={handleExitFromEdit}
      onKeyPress={handleKeyPress}
      onFocus={handleFocus}
      onLabelClick={handleLabelClick}
      background="accordionBg"
      backgroundHover="accordionBgHover"
      placeholder="Enter Objective Name..."
      leftControls={
        <StyledDefaultStepHeadIcon backgroundHover="accordionBgHover" ml="0" onClick={() => setExpanded(!expanded)}>
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </StyledDefaultStepHeadIcon>
      }
      rightControls={
        <StyledFlex gap="10px" marginLeft="auto" direction="row" alignItems="center">
          {hasErrors && (
            <StyledTooltip
              arrow
              placement="top"
              title={errors[`objectives[${index}].name`] || 'Contains Missing Fields'}
              p="10px 15px"
            >
              <StyledFlex marginLeft="auto" flexShrink="0">
                <StyledStepErrorCircle inline />
              </StyledFlex>
            </StyledTooltip>
          )}
          <HeadContextMenu canDelete={objectives.length > 1} onDelete={handleDelete} onDuplicate={handleDuplicate} />
        </StyledFlex>
      }
    />
  );
};

export default memo(ObjectiveAccordionHead);
