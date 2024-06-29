import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo, useCallback, useState } from 'react';

import FormValidationMessage from '../../../../../shared/forms/FormValidationMessage/FormValidationMessage';
import EditAltIcon from '../../../../Assets/Icons/editAlt.svg?component';
import { getStepIdName } from '../../../../services/graph';
import StepIcon from '../../../diagram/steps/StepSquare/StepIcon';
import { Typography } from '../../base';
import { Heading } from '../../sub';
import css from './SideMenuCard.module.css';
import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';

const SideMenuCard = (props) => {
  const { displayName, stepIcon, stepId, name, error, onChange } = props;

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') setIsEditing(false);
    },
    [displayName]
  );

  return (
    <div className={css.card}>
      <span
        className={classnames(css.stepIcon, {
          [css.branch_color]: stepIcon === 'CUSTOM',
          [css.blue]: stepIcon !== 'CUSTOM',
        })}
      >
        <StepIcon iconName={stepIcon} />
      </span>
      <div className={css.right_wrapper}>
        <div className={classnames({ [css.editArea]: !isEditing, [css.editing]: isEditing })}>
          <div className={css.text}>
            {!isEditing && <Heading size="default">{displayName}</Heading>}
            {isEditing && (
              <>
                <BaseTextInput
                  subheading="subheading"
                  value={displayName}
                  name={name}
                  onChange={(e) => onChange(e.target.value)}
                  error={error}
                  onKeyDown={handleChange}
                />
                <FormValidationMessage text={error?.message} />
              </>
            )}
          </div>
          {!isEditing && (
            <div className={css.actions}>
              <span className={css.editAltIcon} onClick={() => setIsEditing(true)}>
                <EditAltIcon />
              </span>
            </div>
          )}
        </div>
        <div className={css.subText}>
          <Typography as="p" variant="small">
            {getStepIdName(stepId)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default memo(SideMenuCard);

SideMenuCard.propTypes = {
  displayName: PropTypes.string,
  stepIcon: PropTypes.string,
  stepId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  onChange: PropTypes.func,
};
