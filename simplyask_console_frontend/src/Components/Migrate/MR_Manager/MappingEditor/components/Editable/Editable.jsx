import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import MappingEditorIcons from '../icons/MappingEditorIcons';
import css from './Editable.module.css';

const Editable = ({
  getValue, row: { index }, column, table: { options }, collapse,
}) => {
  const initialInput = getValue();

  const [input, setInput] = useState(initialInput || '');
  const [isSysIgnoreField, setIsSysIgnoreField] = useState(false);

  const inputRef = useRef(null);

  const { id, columnDef } = column;

  const isCollapsed = collapse[`${columnDef.header.split(' ')[0].toLowerCase()}s`];

  const isDisabled = columnDef.meta?.field?.fieldId === null;

  const onBlur = (e) => {
    if (e.type !== 'blur') return;

    options.meta?.updateRecord(index, id, input);
    inputRef.current.blur();
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return;

    options.meta?.updateRecord(index, id, input);
    inputRef.current.blur();
  };

  const onCellClick = () => {
    if (isDisabled) return;

    inputRef.current.focus();
  };

  useEffect(() => { setInput(initialInput); }, [initialInput]);

  return (
    <div
      className={classnames({
        [css.container]: true,
        [css['container-collapsed']]: isCollapsed,
      })}
      onClick={onCellClick}
    >
      <div className={css.left}>
        <textarea
          id={id}
          name={id}
          className={css.input}
          value={input || ''}
          onChange={(e) => setInput(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          rows={2}
          ref={inputRef}
          autoComplete="off"
        />
      </div>
      <div className={css.right}>
        {!isDisabled && (
          <>
            <input
              className={classnames({
                [css.checkbox]: true,
                [css['checkbox--active']]: isSysIgnoreField,
                // [css['checkbox--disabled']]: isDisabled,
              })}
              type="checkbox"
              checked={isSysIgnoreField}
              onChange={(e) => setIsSysIgnoreField(e.target.checked)}
              disabled={isDisabled}
            />
            <span className={classnames({
              [css.checkmark]: true,
              [css['checkmark--inactive']]: !isSysIgnoreField,
            })}
            >
              <MappingEditorIcons icon="CHECK" />
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Editable;

Editable.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  collapse: PropTypes.object,
};
