import React, { memo } from 'react';
import { StyledDefaultStepHead, StyledDefaultStepHeadArea, StyledDefaultStepHeadLabel } from '../StyledStep';
import { StyledText } from '../../../../../shared/styles/styled';
import { STEP_DRAG_HANDLE_CLASS } from '../../../constants/steps';

const DefaultStepHeadView = ({
  label,
  editing,
  editingDisabled,
  onChange,
  onBlur,
  onKeyPress,
  onFocus,
  onLabelClick,
  background,
  backgroundHover,
  rightControls,
  leftControls,
  placeholder,
  error,
}) => {
  return (
    <StyledDefaultStepHead background={background} className={STEP_DRAG_HANDLE_CLASS}>
      {leftControls}
      {editing ? (
        <StyledDefaultStepHeadArea
          autoFocus
          value={label}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          rows={1}
          maxRows={3}
          backgroundHover={backgroundHover}
          placeholder={placeholder}
        />
      ) : (
        <StyledDefaultStepHeadLabel
          editingDisabled={editingDisabled}
          backgroundHover={backgroundHover}
          onClick={onLabelClick}
        >
          <StyledText wordBreak="break-all" maxLines={3} size={16} lh={16} weight={600}>
            {label || placeholder}
          </StyledText>
        </StyledDefaultStepHeadLabel>
      )}
      {rightControls}
    </StyledDefaultStepHead>
  );
};

export default memo(DefaultStepHeadView);
