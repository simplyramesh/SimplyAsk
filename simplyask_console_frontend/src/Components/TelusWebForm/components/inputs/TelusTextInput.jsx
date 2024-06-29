import css from './TelusInput.module.css';

const TelusTextInput = ({
  label,
  bracketsLabel,
  isValid = true,
  error = '',
  ...props
}) => {
  return (
    <label className={css.input_label}>
      <p className={css.input_label_textWrapper}>
        <span className={css.input_label_text}>{label}</span>
        {bracketsLabel && <span className={css.input_label_textParentheses}>{`(${bracketsLabel})`}</span>}
      </p>
      <input
        type="text"
        className={css.text_input}
        autoComplete="off"
        {...props}
      />
      {!isValid && <p className={css.input_error}>{error}</p>}
    </label>
  );
};

export default TelusTextInput;
