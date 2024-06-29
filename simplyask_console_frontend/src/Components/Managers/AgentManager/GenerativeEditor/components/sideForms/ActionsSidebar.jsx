import { CloseRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import React, { memo, useMemo } from 'react';
import CustomScrollbar from 'react-custom-scrollbars-2';
import { useRecoilState, useRecoilValue } from 'recoil';
import { generateUUID } from '../../../../../Settings/AccessManagement/utils/helpers';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { StyledActionSidebar } from '../../StyledGenerativeEditor';
import { ACTION_TYPES, DUPLICATE_NAME_COPY } from '../../constants/core';
import { getUniqueNameRecursively } from '../../formmaters';
import { generativeEditorActionOpened, generativeEditorErrors, generativeEditorObjectivesState } from '../../store';
import ActionFormContainer from './ActionFormContainer';
import SidebarContextMenu from './SidebarContextMenu';

const getCountOfRequredFields = (type) => {
  switch (type) {
    case ACTION_TYPES.INVOKE_API:
      return 3;
    case ACTION_TYPES.EXECUTE_PROCESS:
      return 2;
    case ACTION_TYPES.QUERY_KNOWLEDGE_BASE:
      return 2;
    case ACTION_TYPES.TRANSFER_TO_AGENT:
      return 2;
    default:
      return 2;
  }
};

const ActionsSidebar = () => {
  const { colors } = useTheme();

  const [actionOpened, setActionOpened] = useRecoilState(generativeEditorActionOpened);
  const [objectives, setObjectives] = useRecoilState(generativeEditorObjectivesState);

  const { objectiveDesignId, actionDesignId } = actionOpened || {};
  const objectiveIndex = objectives.findIndex((objective) => objective.designId === objectiveDesignId);
  const actionIndex = objectives[objectiveIndex]?.actions.findIndex((action) => action.designId === actionDesignId);

  const action = useMemo(
    () => objectives[objectiveIndex]?.actions[actionIndex],
    [objectives, objectiveIndex, actionIndex]
  );

  const errors = useRecoilValue(generativeEditorErrors);

  const errorsPath = `objectives[${objectiveIndex}].actions[${actionIndex}]`;

  const countOfUnfilled = Object.keys(errors).filter((key) => key.includes(errorsPath)).length || 0;
  const countOfRequiredFields = useMemo(() => getCountOfRequredFields(action?.type), [action?.type]);
  const countOfFilled = countOfRequiredFields - countOfUnfilled;

  const handleDeleteAction = () => {
    setObjectives((prev) =>
      setIn(
        prev,
        [objectiveIndex, 'actions'],
        prev[objectiveIndex].actions.filter((_, i) => i !== actionIndex)
      )
    );

    setActionOpened(null);
  };

  const handleDuplicateAction = () => {
    const newActionDesignId = generateUUID();
    const objectiveIndex = objectives.findIndex((objective) => objective.designId === objectiveDesignId);
    const modifiedActions = objectives[objectiveIndex].actions;
    const actionIndex = modifiedActions.findIndex((action) => action.designId === actionDesignId);

    const { name: originalName } = modifiedActions[actionIndex];
    let duplicatedNameCopy = '';
    
    if (originalName) {
      const baseName = originalName.includes(DUPLICATE_NAME_COPY)
        ? originalName.split(DUPLICATE_NAME_COPY)[0]
        : originalName;

      duplicatedNameCopy = getUniqueNameRecursively(baseName, modifiedActions);
    }

    modifiedActions.splice(actionIndex + 1, 0, {
      ...action,
      name: duplicatedNameCopy,
      designId: newActionDesignId,
      id: null, // cleanup ID to avoid errors
    });

    setObjectives((prev) => setIn(prev, [objectiveIndex, 'actions'], modifiedActions));

    setActionOpened({
      actionDesignId: newActionDesignId,
      objectiveDesignId,
    });
  };

  return (
    <StyledActionSidebar>
      <StyledFlex
        as="span"
        onClick={() => setActionOpened(null)}
        cursor="pointer !important"
        fontSize="31px"
        padding="13px 0 3px 13px"
        width="32px"
      >
        <CloseRounded fontSize="inherit" />
      </StyledFlex>
      <StyledFlex p="20px" flexGrow="1">
        <StyledFlex>
          <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
            <StyledText size={19} weight={600} lh={29}>
              Action Configuration
            </StyledText>
            <SidebarContextMenu onDelete={handleDeleteAction} onDuplicate={handleDuplicateAction} />
          </StyledFlex>
          {countOfRequiredFields > 0 && (
            <StyledText
              size={15}
              lh={23}
              weight={600}
              color={countOfFilled === countOfRequiredFields ? colors.statusResolved : colors.statusOverdue}
            >
              {`${countOfFilled} / ${countOfRequiredFields} Required Fields Completed`}
            </StyledText>
          )}
        </StyledFlex>
        <StyledDivider borderWidth={1.5} color={colors.cardGridItemBorder} m="30px -20px 0 -20px" />
        <StyledFlex m="0 -20px" flexGrow="1">
          <CustomScrollbar autoHeight autoHide autoHeightMax={window.innerHeight - 310}>
            <StyledFlex p="30px 20px">
              <ActionFormContainer
                key={`${objectiveIndex}-${actionIndex}`}
                action={action}
                objectiveIndex={objectiveIndex}
                actionIndex={actionIndex}
                errorsPath={errorsPath}
              />
            </StyledFlex>
          </CustomScrollbar>
        </StyledFlex>
      </StyledFlex>
    </StyledActionSidebar>
  );
};

export default memo(ActionsSidebar);
