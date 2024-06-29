import classnames from 'classnames';
import PropTypes from 'prop-types';

import { ERROR_TYPES } from '../../../../utils/validation';
import { Typography } from '../../base';
import { Heading } from '../../sub';
import css from './LabeledField.module.css';

const LabeledField = ({
  error,
  label,
  isOptional,
  isRecommended,
  noWrap,
  inAccordion,
  children,
  promptText,
  marginBottom,
  gap,
  noPad,
}) => {
  return (
    <div
      className={classnames({
        [css.wrapper]: true,
        [css.inAccordion]: inAccordion,
        [css[`gap${gap}`]]: gap,
        [css.noPadding]: noPad,
      })}
    >
      {label && (
        <div
          className={classnames({
            [css.label]: true,
            [css[`marginBottom${marginBottom}`]]: marginBottom,
            [css.warning]: error?.type === ERROR_TYPES.WARNING,
          })}
        >
          <Heading as="h4" size="default" promptText={promptText} noWrap={noWrap}>
            {label}
          </Heading>
          {isOptional && !isRecommended && (
            <Typography as="p" variant="small" color="gray" weight="regular">
              (optional)
            </Typography>
          )}
          {isRecommended && (
            <Typography as="p" variant="small" color="gray" weight="regular">
              (recommended)
            </Typography>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default LabeledField;

LabeledField.defaultProps = {
  label: '',
  inAccordion: false,
};

LabeledField.propTypes = {
  label: PropTypes.string,
  promptText: PropTypes.string,
  children: PropTypes.node,
  isOptional: PropTypes.bool,
  isRecommended: PropTypes.bool,
  noWrap: PropTypes.bool,
  inAccordion: PropTypes.bool,
  marginBottom: PropTypes.number,
  error: PropTypes.shape({
    type: PropTypes.oneOf([ERROR_TYPES.ERROR, ERROR_TYPES.WARNING]),
    message: PropTypes.string,
  }),
  gap: PropTypes.number,
  noPad: PropTypes.bool,
};
