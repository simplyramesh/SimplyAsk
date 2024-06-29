import css from './TelusCard.module.css';

const TelusCard = ({
  overline, title, children,
}) => {
  return (
    <div className={css.card_container}>
      <p className={css.card_overline}>{overline}</p>
      <h2 className={css.card_title}>{title}</h2>
      <hr className={css.card_divider} />
      <div className={css.card_content}>
        {children}
      </div>
    </div>
  );
};

export default TelusCard;
