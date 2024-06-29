import css from './TelusCheckboxGroup.module.css';

const TelusCheckboxGroup = ({ label, children }) => {
  return (
    <div className={css.checkbox_group_container}>
      <p className={css.checkbox_groupLabel_text}>{label}</p>
      <div className={css.checkbox_group}>
        {children}
      </div>
    </div>
  );
};

export default TelusCheckboxGroup;
