import TelusSubmitBtn from '../../TelusSubmitBtn/TelusSubmitBtn';
import css from './TelusSubmitBtnSection.module.css';

const TelusSubmitBtnSection = ({
  text, btnText, btnWidth, ...props
}) => {
  const isTextStr = typeof text === 'string';

  return (
    <div className={css.btn_section_container}>
      {text && isTextStr
        ? <p className={css.btn_section_text}>{text}</p>
        : text}
      <TelusSubmitBtn {...props} style={{ '--btn_width': btnWidth }}>{btnText}</TelusSubmitBtn>
    </div>
  );
};

export default TelusSubmitBtnSection;
