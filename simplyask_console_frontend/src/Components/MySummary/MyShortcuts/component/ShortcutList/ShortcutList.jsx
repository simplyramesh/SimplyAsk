import PropTypes from 'prop-types';
import React, { memo } from 'react';

import ShortcutItem from '../ShortcutItem/ShortcutItem';
import { StyledShortcutList } from './StyledShortcutList';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Spinner from '../../../../shared/Spinner/Spinner';

const ShortcutList = ({
  list,
  editable,
  onClick,
  onRemoveItem,
  customStyle = {},
  isDragDisabled,
  isShortcutsFetching,
}) => {
  return (
    <StyledShortcutList margin={customStyle?.margin} maxHeight={customStyle?.maxHeight}>
      {isShortcutsFetching && <Spinner parent fadeBgParent small />}
      <Droppable droppableId="shortcuts">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {list?.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ ...provided.draggableProps.style }}
                  >
                    <ShortcutItem
                      shortcut={item}
                      editable={editable}
                      handleSelect={(item) => onClick?.(item?.urlKey)}
                      handleRemove={(item) => onRemoveItem(item?.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </StyledShortcutList>
  );
};

export default memo(ShortcutList);

ShortcutList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      icon: PropTypes.string,
      label: PropTypes.string,
      order: PropTypes.number,
    })
  ),
  editable: PropTypes.bool,
  selectItem: PropTypes.func,
  removeItem: PropTypes.func,
  customStyle: PropTypes.shape({
    margin: PropTypes.string,
    padding: PropTypes.string,
    maxHeight: PropTypes.string,
  }),
};
