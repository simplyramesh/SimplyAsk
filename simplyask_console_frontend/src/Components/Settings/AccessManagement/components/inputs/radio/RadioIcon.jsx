import RadioOffIcon from '../../../../../../Assets/icons/radioOff.svg?component';
import RadioOnIcon from '../../../../../../Assets/icons/radioOn.svg?component';
import css from './RadioInput.module.css';

const RadioIcon = () => {
  return (
    <span className={css.icon_container}>
      <RadioOffIcon className={css.icon_off} />
      <RadioOnIcon className={css.icon_on} />
    </span>
  );
};

export default RadioIcon;
