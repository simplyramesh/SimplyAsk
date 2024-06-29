import PropTypes from 'prop-types';

import MappingEditorIcons from '../../icons/MappingEditorIcons';
import css from './MoveRow.module.css';

const MoveRow = ({ dragRef, row }) => {
  return (
    <p className={css.drag} ref={dragRef}>
      <span className={css.drag_icon}><MappingEditorIcons icon="DRAG" /></span>
      <span className={css.drag_text}>{`${row.index + 1}`}</span>
    </p>
  );
};

export default MoveRow;

MoveRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  dragRef: PropTypes.func,
};
