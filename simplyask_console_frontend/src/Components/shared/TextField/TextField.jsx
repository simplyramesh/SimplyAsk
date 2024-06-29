import { useField } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import alertRedIcon from '../../../Assets/icons/alertRedIcon.svg';
import classes from './TextField.module.css';

const TextField = ({
  label,
  hideLabel = false,
  isOptional = false,
  fullInputWidth = false,
  width220 = false,
  width135 = false,
  setAddressError = () => {},
  largeHeightInput = false,
  showCharacterCount = false,
  setIsFormDirty = () => {},
  setDoesFormContainsError = () => {},
  inputClassName,
  textFieldClassName,
  ...props
}) => {
  const [field, meta] = useField(props);
  const [countChar, setCountChar] = useState();

  useEffect(() => {
    const countLength = { ...field };
    setCountChar(countLength.value?.length);
  }, [field]);

  useEffect(() => {
    if (meta?.error && field.name === 'streetAddressLine1' && meta?.touched) {
      setAddressError(true);
    } else setAddressError(false);
  }, [meta?.error, field.name]);

  useEffect(() => {
    if (meta) {
      if (JSON.stringify(meta.value) === JSON.stringify(meta.initialValue)) {
        setIsFormDirty((prev) => ({ ...prev, [field.name]: false }));
      } else setIsFormDirty((prev) => ({ ...prev, [field.name]: true }));

      if ((meta.error && meta.touched) || (showCharacterCount && countChar > showCharacterCount)) {
        setDoesFormContainsError((prev) => ({
          ...prev,
          [field.name]: true,
        }));
      } else {
        setDoesFormContainsError((prev) => ({
          ...prev,
          [field.name]: false,
        }));
      }
    }
  }, [meta?.value, meta?.error, meta?.touched, countChar]);

  return (
    <div className={`${classes.flex_col} ${textFieldClassName}`}>
      {!hideLabel && !isOptional && (
        <label className={classes.label} htmlFor={field.name}>
          {label}
        </label>
      )}

      {isOptional && (
        <div className={classes.flex_row}>
          <label className={classes.label} htmlFor={field.name}>
            {label}
          </label>
          <span className={classes.optionalSpan}>(Optional)</span>
        </div>
      )}

      {largeHeightInput ? (
        <textarea
          autoComplete="off"
          className={`${classes.input}
         ${fullInputWidth && classes.fullInputWidth}
         ${width220 && classes.width220}
         ${width135 && classes.width135}
         ${meta?.error && meta.touched && classes.invalidRedBorder}
         ${meta?.error && meta.touched && field.name === 'streetAddressLine1' && classes.fixAddressInputPosition}
         ${largeHeightInput && classes.largeHeightInput}
         ${inputClassName}`}
          {...props}
          {...field}
        />
      ) : (
        <input
          autoComplete="off"
          className={`${classes.input}
         ${fullInputWidth && classes.fullInputWidth}
         ${width220 && classes.width220}
         ${width135 && classes.width135}
         ${meta?.error && meta.touched && classes.invalidRedBorder}
         ${meta?.error && meta.touched && field.name === 'streetAddressLine1' && classes.fixAddressInputPosition}
         ${inputClassName}`}
          {...props}
          {...field}
        />
      )}

      {showCharacterCount && (
        <div
          className={`${classes.showCharacterCount}
         ${meta?.error && meta.touched && classes.showCharacterCountError}
         ${countChar > showCharacterCount && classes.redColorCountText}`}
        >
          {' '}
          {countChar} / {showCharacterCount} characters
        </div>
      )}

      {meta?.error && meta.touched && (
        <div
          className={`${classes.flex_row}
        ${classes.gap_10px} 
        ${field.name === 'streetAddressLine1' && classes.fixAddressErrorPosition}`}
        >
          <div className={classes.centerVertically}>
            <img src={alertRedIcon} />
          </div>
          <div className={classes.redColorText}>{meta?.error}</div>
        </div>
      )}
    </div>
  );
};

export default TextField;

TextField.propTypes = {
  label: PropTypes.string,
  textFieldClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  hideLabel: PropTypes.bool,
  isOptional: PropTypes.bool,
  fullInputWidth: PropTypes.bool,
  width220: PropTypes.bool,
  width135: PropTypes.bool,
  largeHeightInput: PropTypes.bool,
  showCharacterCount: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  setAddressError: PropTypes.func,
  setIsFormDirty: PropTypes.func,
  setDoesFormContainsError: PropTypes.func,
};
