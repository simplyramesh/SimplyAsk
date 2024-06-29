import css from './TelusInput.module.css';

const TelusCheckbox = ({ label, ...props }) => {
  return (
    <label className={css.checkbox_label}>
      <span className={css.checkbox_label_text}>{label}</span>
      <input type="checkbox" className={css.checkbox_input} {...props} />
    </label>
  );
};

export default TelusCheckbox;
