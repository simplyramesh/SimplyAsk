import TelusWebFormIcons from '../TelusWebFormIcons/TelusWebFormIcons';
import css from './TelusLayout.module.css';

const TelusHeader = ({
  language = null,
  onLanguageChange = () => { },
}) => {
  const btnClassName = (l) => `${css.header_language_btn} ${l === language
    ? css['header_language_btn--active']
    : ''
  }`;

  return (
    <div className={css.header_wrapper}>
      <div className={css.header_top} />
      <section className={css.header_bottom}>
        <TelusWebFormIcons icon={language || 'en'} />
        {!!language && (
          <div className={css.header_btn_container}>
            <button
              id="en"
              name="english"
              value="en"
              className={btnClassName('en')}
              onClick={onLanguageChange}
            >
              EN
            </button>
            <button
              id="fr"
              name="french"
              value="fr"
              className={btnClassName('fr')}
              onClick={onLanguageChange}
            >
              FR
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default TelusHeader;
