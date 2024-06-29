import css from './TelusMain.module.css';

const TelusMain = ({ title, subtitle, children }) => {
  return (
    <div className={css.main_container}>
      <main className={css.main}>
        <div className={css.main_text_container}>
          <h1 className={css.main_title}>{title}</h1>
          <p className={css.main_subtitle}>{subtitle}</p>
        </div>
        <div className={css.main_children}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default TelusMain;
