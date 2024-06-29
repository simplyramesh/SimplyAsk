import TelusFooter from './TelusFooter';
import TelusHeader from './TelusHeader';
import css from './TelusLayout.module.css';
import TelusMain from './TelusMain/TelusMain';

const TelusPageLayout = ({
  title,
  subtitle,
  withTranslation = false,
  language,
  onLanguageChange = () => { },
  children,
}) => {
  return (
    <div className={css.webForm_container}>
      <TelusHeader language={language} withTranslation={withTranslation} onLanguageChange={onLanguageChange} />
      <TelusMain title={title} subtitle={subtitle}>
        {children}
      </TelusMain>
      <TelusFooter />
    </div>
  );
};

export default TelusPageLayout;
