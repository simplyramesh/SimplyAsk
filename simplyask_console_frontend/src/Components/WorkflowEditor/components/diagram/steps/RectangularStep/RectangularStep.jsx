import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { useDrag } from 'react-dnd';

import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import DragAndDropIcon from '../../../../Assets/Icons/DragAndDropIcon.svg';
import { DEFAULT_STEP_TYPE_ICON } from '../../../../constants/graph';
import StepIcon from '../StepSquare/StepIcon';

const getStepColors = (colors, type = DEFAULT_STEP_TYPE_ICON) => {
  switch (type) {
    case 'FALLOUT_TICKET':
    case 'CREATE_SERVICE_TICKET':
    case 'GENERIC_SERVICE_TICKET':
    case 'LINK':
    case 'MAIL':
    case 'MESSAGE':
    case 'TEST_GIVEN':
    case 'GET_DATE_TIME':
    case 'EVALUATE_EXPRESSION':
    case 'SET_PARAMETER_VALUE':
    case 'CREATE_EXCEL_SPREADSHEET':
    case 'EXTRACT_EXCEL_DATA':
    case 'UPDATE_EXCEL_DATA':
    case 'EXTRACT_DATA':
    case 'START_EXTRACTION':
    case 'SAVE_RECORD':
    case 'BATCH_PREPARATION':
    case 'END_EXTRACTION':
    case 'START_TRANSFORMATION':
    case 'RECORD_TRANSFORM':
    case 'END_TRANSFORMATION':
    case 'START_LOADING':
    case 'END_LOADING':
    case 'TRIGGER_PROCESS_DELEGATE':
      return {
        backgroundColor: colors.iconBgBlue,
        color: colors.iconColorBlue,
      };

    case 'CUSTOM':
    case 'LOOP_START':
    case 'LOOP_END':
    case 'LOOP_START_EARLY':
    case 'END_PROCESSING':
    case 'TEST_WHEN':
    case 'SIMPLYASSISTANT':
    case 'RPA_START':
      return {
        backgroundColor: colors.iconBgOrange,
        color: colors.iconColorOrange,
      };
    case 'TEST_THEN':
      return {
        backgroundColor: colors.iconBgGreen,
        color: colors.iconColorOrange,
      };
    default:
      return {
        backgroundColor: colors.iconBgOrange,
        color: colors.iconColorOrange,
      };
  }
};

const RectangularStep = memo(({ item }) => {
  const [{ opacity, isDragging }, drag] = useDrag(
    () => ({
      type: 'regular',
      item,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.8 : 1,
        isDragging: monitor.isDragging(),
      }),
    }),
    [item]
  );
  const { colors } = useTheme();

  const StyledStepTooltipTitle = memo(({ name, description }) => {
    return (
      <>
        <StyledText size={12} lh={18} color={colors.primary} weight={600}>
          {name}
        </StyledText>
        {description && (
          <StyledText mt={1} size={12} lh={18} color={colors.primary} opacity={0.65}>
            {description}
          </StyledText>
        )}
      </>
    );
  });

  const StyledStepTooltip = styled(StyledTooltip, {
    shouldForwardProp: (prop) => isPropValid(prop) || prop === 'placement',
  })(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      maxWidth: 328,
      width: 328,
      backgroundColor: theme.colors.white,
      boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)',
      borderRadius: '5px',
      padding: '10px',
    },
  }));

  return (
    <StyledFlex position="relative" opacity={opacity} cursor="grab" ref={drag}>
      <StyledStepTooltip
        title={<StyledStepTooltipTitle name={item.stepDelegateName} description={item.stepDelegateDescription} />}
        placement="left"
        // hack to avoid artifacts on delegates hovering
        {...(isDragging ? { open: false } : {})}
      >
        <StyledFlex
          height={44}
          flexDirection="row"
          alignItems="center"
          gap={1}
          paddingX={1}
          paddingY={0.5}
          borderRadius={1}
          backgroundColor={colors.white}
          boxShadow="0px 0px 4px rgba(0, 0, 0, 0.2)"
          zIndex={1}
        >
          <StyledFlex
            alignItems="center"
            justifyContent="center"
            width={30}
            height={30}
            padding={1}
            borderRadius="5px"
            {...getStepColors(colors, item.stepDelegateIcon)}
          >
            <StepIcon iconName={item.stepDelegateIcon} />
          </StyledFlex>

          <StyledText size={12} lh={18} weight={600} color={colors.primary} maxLines={2}>
            {item.stepDelegateName}
          </StyledText>

          <StyledFlex ml="auto" width={16} transform="rotate(90deg)">
            <img src={DragAndDropIcon} alt="dragAndDropIcon" />
          </StyledFlex>
        </StyledFlex>
      </StyledStepTooltip>
      {item.location && item.location.length ? (
        <StyledFlex
          position="relative"
          top={-8}
          mb={-1}
          pt={1.5}
          pb={0.5}
          pl={1}
          pr={1}
          backgroundColor={colors.locationBg}
          borderRadius="5px"
          zIndex={0}
        >
          <StyledText size={12} lh={16}>
            {item.location.join(' / ')}
          </StyledText>
        </StyledFlex>
      ) : null}
    </StyledFlex>
  );
});

RectangularStep.propTypes = {
  item: PropTypes.shape({
    stepDelegateType: PropTypes.string,
    stepDelegateCategory: PropTypes.string,
    stepDelegateName: PropTypes.string,
    stepDelegateIcon: PropTypes.string,
    stepDelegateDescription: PropTypes.string,
  }).isRequired,
};

export default RectangularStep;
