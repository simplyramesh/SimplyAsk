import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';

import ExpandIcon from '../../../../../Assets/Icons/fullScreen.svg?component';
import { ERROR_TYPES } from '../../../../../utils/validation';
import { Typography } from '../../index';
import ExpandedEditor from './ExpandedEditor/ExpandedEditor';
import css from './MessageBox.module.css';

const MessageBox = (props) => {
  const { subheading, enableExpand, value, placeholder, name, onChange, error } = props;

  const [isExpandedOpen, setIsExpandedOpen] = useState(false);

  return (
    <>
      {enableExpand && isExpandedOpen && (
        <ExpandedEditor
          isPortalOpen={isExpandedOpen}
          onClose={() => setIsExpandedOpen(false)}
          onChange={onChange}
          name={name}
          value={value}
          placeholder={placeholder}
          error={error}
        />
      )}
      <section className={css.container}>
        <div className={css.box}>
          <Typography as="p" variant="xsmall" color="gray">
            {subheading}
          </Typography>
          <textarea
            className={classnames({
              [css.textarea]: true,
              [css.error]: error?.type === ERROR_TYPES.ERROR,
              [css.warning]: error?.type === ERROR_TYPES.WARNING,
            })}
            autoComplete="off"
            value={value || ''}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
          />
          {enableExpand && (
            <span className={css.expandIcon} onClick={() => setIsExpandedOpen(true)}>
              <ExpandIcon />
            </span>
          )}
        </div>
      </section>
    </>
  );
};

export default memo(MessageBox);

MessageBox.propTypes = {
  subheading: PropTypes.string,
  enableExpand: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
};
