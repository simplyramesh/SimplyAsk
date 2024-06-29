import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';

import AutocompleteExpandedModal from '../../../../../../shared/REDISIGNED/modals/AutocompleteExpandedModal/AutocompleteExpandedModal';
import ExpandIcon from '../../../../../Assets/Icons/fullScreen.svg?component';
import { ERROR_TYPES } from '../../../../../utils/validation';
import AddDeleteButton from '../AddDeleteButton/AddDeleteButton';
import FlowExpressionBuilder from '../WorkflowEditorExpressionBuilder/WorkflowEditorExpressionBuilder';
import css from './InputField.module.css';

const INPUT_HEIGHT = 42;
const LINE_HEIGHT = 20;

const wasEnterKeyPressed = (e, ref, onEnterKeyPress) => {
  const isEnterPressed = e.key === 'Enter';
  const isEscapePressed = e.key === 'Escape';

  if (isEnterPressed || isEscapePressed) {
    ref.current.blur();

    if (typeof onEnterKeyPress === 'function') onEnterKeyPress(e, true);
  }
};

const InputField = (props) => {
  const {
    placeholder,
    onChange,
    value,
    name,
    error,
    textfield,
    rows = 1,
    plusIcon,
    deleteIcon,
    onIconClick,
    stepId,
    onEnterKeyPress,
    paramAutocomplete = false,
    id,
    expandable,
    minHeight,
    isIconDisabled = false,
    enableVerticalResize = false,
    enableHorizontalResize = false,
    type = 'text',
    ...rest
  } = props;

  const inputRef = useRef(null);
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);
  const [confirmedValue, setConfirmedValue] = useState(null);
  const [confirmedStepId, setConfirmedStepId] = useState('');

  const handleExpressionBuilderChange = (value) => {
    if (confirmedValue) {
      setConfirmedValue(null);
      setConfirmedStepId(stepId);
    }

    onChange(value);
  };

  useEffect(() => {
    if (!paramAutocomplete && !textfield) return;
    if (stepId && confirmedStepId !== stepId) {
      setConfirmedStepId(stepId);
    }
  }, [stepId]);

  useEffect(() => {
    if (inputRef.current && value?.length > 0) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(value.length, value.length);
    }
  }, [inputRef]);

  const handleChange = (e) => {
    const { textLength, scrollHeight, offsetHeight } = e.target;

    const preserveScrollPosition = () => {
      if (inputRef.current) {
        inputRef.current.scrollTop = savedScrollTop;
      }
    };
    const savedScrollTop = inputRef.current ? inputRef.current.scrollTop : 0;

    e.target.style.minHeight = `${INPUT_HEIGHT}px`;
    e.target.style.height = `${INPUT_HEIGHT}px`;
    e.target.style.height = `${scrollHeight}px`;
    e.target.style.height = `${scrollHeight % LINE_HEIGHT !== 0 ? offsetHeight - LINE_HEIGHT : scrollHeight}px`;

    if (textLength === 0) e.target.style.height = `${INPUT_HEIGHT}px`;

    if (typeof onChange === 'function') {
      onChange(e);
      preserveScrollPosition();
    }
  };

  const classNames = classnames({
    [css.input]: true,
    [css.inputPadding]: true,
    [css.error]: error?.type === ERROR_TYPES.ERROR,
    [css.warning]: error?.type === ERROR_TYPES.WARNING,
  });

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        {isExpandedOpen && (
          <AutocompleteExpandedModal
            open={isExpandedOpen}
            value={value}
            placeholder={placeholder}
            onClose={() => setIsExpandedOpen(false)}
            onConfirm={(val) => {
              onChange(val);
              setConfirmedValue(val);
              setIsExpandedOpen(false);
            }}
          />
        )}
        {!textfield && !paramAutocomplete && (
          <input
            {...rest}
            type={type}
            className={classNames}
            placeholder={placeholder}
            defaultValue={value || ''}
            name={name}
            onKeyDown={(e) => wasEnterKeyPressed(e, inputRef, onEnterKeyPress)}
            onChange={onChange}
            ref={inputRef}
            autoComplete="off"
          />
        )}
        {textfield && !paramAutocomplete && (
          <textarea
            {...rest}
            type={type}
            placeholder={placeholder}
            defaultValue={value || ''}
            name={name}
            rows={rows}
            className={classNames}
            onChange={handleChange}
            onKeyDown={(e) => wasEnterKeyPressed(e, inputRef, onEnterKeyPress)}
            onFocus={handleChange}
            ref={inputRef}
          />
        )}
        {paramAutocomplete && (
          <>
            <FlowExpressionBuilder
              id={`expression-builder-${id}`}
              key={`expression-builder-${id}-${confirmedValue}-${confirmedStepId}`} // required to re-render the component when the modal is closed
              placeholder={placeholder}
              onChange={(val) => handleExpressionBuilderChange(JSON.stringify(val))}
              editorState={confirmedValue ?? value}
              error={error}
              minHeight={minHeight}
              textarea={textfield}
              enableVerticalResize={enableVerticalResize}
              enableHorizontalResize={enableHorizontalResize}
            />
            {expandable && (
              <span className={css.expandIcon} onClick={() => setIsExpandedOpen(true)}>
                <ExpandIcon />
              </span>
            )}
          </>
        )}
      </div>
      {(plusIcon || deleteIcon) && (
        <AddDeleteButton
          onIconClick={onIconClick}
          plusIcon={plusIcon}
          deleteIcon={deleteIcon}
          isIconDisabled={isIconDisabled}
        />
      )}
    </div>
  );
};

export default memo(InputField);

InputField.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  name: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.shape({
      type: PropTypes.string,
      message: PropTypes.string,
    }),
    PropTypes.bool,
  ]),
  textfield: PropTypes.bool,
  plusIcon: PropTypes.bool,
  deleteIcon: PropTypes.bool,
  onIconClick: PropTypes.func,
  expandable: PropTypes.bool,
  subheading: PropTypes.string,
  type: PropTypes.string,
  onEnterKeyPress: PropTypes.func,
  maxWidth: PropTypes.string,
  paramAutocomplete: PropTypes.bool,
  isIconDisabled: PropTypes.bool,
  isExpression: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
};
