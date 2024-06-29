import TelusWebFormIcons from '../TelusWebFormIcons/TelusWebFormIcons';
import css from './TelusLayout.module.css';

const TelusFooter = () => {
  return (
    <footer className={css.footer}>
      <TelusWebFormIcons icon="logo" />
      <div>
        <p className={css.footer_text}>©2023 TELUS</p>
      </div>
    </footer>
  );
};

export default TelusFooter;
