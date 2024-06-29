import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useContext } from 'react';
import { useDrag } from 'react-dnd';

import SuccessIcon from '../../../../../../Assets/icons/greenCircleSuccess.svg?component';
import ErrorIcon from '../../../../../../Assets/icons/redCircleError.svg?component';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { DEFAULT_STEP_TYPE_ICON } from '../../../../constants/graph';
import { getStepIdName } from '../../../../services/graph';
import { WorkflowEditorConfig } from '../../../../WorkflowEditorConfig';

import StepIcon from './StepIcon';
import classes from './StepSquare.module.css';

const StepSquare = ({ item, isStepEditing, onEdit, id }) => {
  const { isReadOnly } = useContext(WorkflowEditorConfig);

  const {
    stepIcon,
    displayName,
    stepId,
    hasWarning,
    hasError,
    isHighlighted,
    hasExecutionError,
    isCurrentlyExecuting,
  } = item || {};

  const [, drag, preview] = useDrag(
    () => ({
      type: 'regular',
      item,
      canDrag: !isReadOnly,
    }),
    [item]
  );

  const tooltip =
    (hasWarning &&
      'This Step contains at least 1  incomplete recommended field. If you want to leave it empty, ignore this warning.') ||
    (hasError && 'There are incomplete required fields in this Step.');

  /*
   * if hasExecutionError:
   * true - red
   * false - green
   * null - white
   */

  const hasExecErr = hasExecutionError === true;
  const hasNotExecErr = hasExecutionError === false;

  return (
    <section
      className={classnames({
        [classes.step_container]: true,
        [classes.readOnly]: isReadOnly,
        [classes.hasExecutionError]: hasExecErr,
        [classes.hasNotExecutionError]: hasNotExecErr,
        [classes.highlighted]: isHighlighted,
        [classes.isCurrentlyExecuting]: isCurrentlyExecuting,
        [classes.isStepEditing]: isStepEditing,
      })}
      ref={preview}
      id={id}
    >
      <section className={classes.step_card} ref={drag} onClick={() => onEdit(item.stepId)}>
        {/* Right corner */}
        {(hasWarning || hasError) && (
          <>
            <section
              className={classnames({
                [classes.step_alert]: true,
                [classes.error]: hasError,
                [classes.warning]: hasWarning && !hasError,
              })}
            />
            <section
              className={classnames({
                [classes.step_alertInner]: true,
                [classes.error]: hasError,
                [classes.warning]: hasWarning && !hasError,
              })}
            >
              <StyledTooltip title={tooltip} arrow placement="top" p="10px 15px" maxWidth="auto">
                <section className={classes.step_alertIcon}>
                  <StepIcon iconName="bang" />
                </section>
              </StyledTooltip>
            </section>
          </>
        )}

        {/* ReadOnly icons */}
        {isReadOnly && (hasExecErr || hasNotExecErr) && (
          <section className={classes.readOnlyIcon}>{hasExecErr ? <ErrorIcon /> : <SuccessIcon />}</section>
        )}

        {/* Main */}
        <section className={`${classes.step_iconContainer} ${classes[stepIcon || DEFAULT_STEP_TYPE_ICON]}`}>
          <section className={classes.step_icon}>
            <StepIcon iconName={stepIcon} />
          </section>
        </section>
        <section className={classes.step_text}>
          <section className={classes.step_title}>{displayName}</section>
          <section className={classes.step_taskId}>{getStepIdName(stepId)}</section>
        </section>
      </section>
    </section>
  );
};

export default memo(StepSquare);

StepSquare.propTypes = {
  item: PropTypes.shape({
    stepIcon: PropTypes.string,
    hasWarning: PropTypes.bool,
    hasError: PropTypes.bool,
    displayName: PropTypes.string,
    stepId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onEdit: PropTypes.func,
};
