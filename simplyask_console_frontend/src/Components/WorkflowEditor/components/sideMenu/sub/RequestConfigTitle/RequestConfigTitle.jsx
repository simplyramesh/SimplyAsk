import PropTypes from 'prop-types';

import { VALIDATION_MESSAGE_KEYS } from '../../SideMenu';
import { Heading } from '..';
import ValidationMessage from '../validation/ValidationMessage';
import css from './RequestConfigTitle.module.css';

const RequestConfigTitle = ({
  title, withValidation, required, completed,
}) => {
  return (
    <>
      <div className={css.configuration_title}>
        <Heading as="h3" size="large">{title}</Heading>
        {withValidation && <ValidationMessage variant={VALIDATION_MESSAGE_KEYS.REQUIRED_FIELDS_COMPLETED} color={completed === required ? 'green' : 'red'} message={`${completed}/${required} Required Fields Completed`} />}
      </div>
    </>
  );
};

export default RequestConfigTitle;

RequestConfigTitle.defaultProps = {
  title: 'Request Configuration',
  completed: {
    min: 0,
    max: 0,
  },
  withValidation: false,
};

RequestConfigTitle.propTypes = {
  title: PropTypes.string,
  withValidation: PropTypes.bool,
  completed: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  required: PropTypes.number,
};
