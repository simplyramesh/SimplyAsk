import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';

const DND_TYPE = 'row';

const RowDnd = ({ row, children, meta }) => {
  const [, dropRef] = useDrop({
    accept: DND_TYPE,
    drop: (draggedRow) => meta.moveRow(draggedRow.index, row.index),
  });
  // console.log('row', row);
  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: DND_TYPE,
  });

  return (
    <>
      {children({
        previewRef, dropRef, dragRef, isDragging,
      })}
    </>
  );
};

export default RowDnd;

RowDnd.propTypes = {
  row: PropTypes.object,
  meta: PropTypes.object,
  children: PropTypes.func,
};
