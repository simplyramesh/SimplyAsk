import css from './TelusSubmitBtn.module.css';

const TelusSubmitBtn = ({ children, ...props }) => {
  return (
    <button className={css.submit_btn} {...props}>
      {children}
    </button>
  );
};

export default TelusSubmitBtn;
