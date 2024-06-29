import React from 'react';
import { useSetRecoilState } from 'recoil';

import DeleteItem from '../../../../../shared/components/ContextMenus/items/DeleteItem';
import { ContextMenu } from '../../../../../shared/components/ContextMenus/StyledContextMenus';
import {
  orchestratorContextMenu,
  orchestratorEdgesRemoveById,
} from '../../../store';

const EdgeContextMenu = ({
  left, top, bottom, right, id,
}) => {
  const setContextMenu = useSetRecoilState(orchestratorContextMenu);
  const removeEdgeId = useSetRecoilState(orchestratorEdgesRemoveById);

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = () => {
    removeEdgeId(id);
    handleCloseMenu();
  };

  const isOpen = top || left || bottom || right;

  return (
    <ContextMenu
      open={!!isOpen}
      onClose={handleCloseMenu}
      style={{
        top, left, right, bottom,
      }}
      maxWidth="108px"
      MenuListProps={{
        onMouseLeave: handleCloseMenu,
      }}
      anchorReference="none"
      rootpadding="5px 0"
      marginbottom="0px"
    >
      <DeleteItem onClick={handleDelete} label="Delete" />
    </ContextMenu>
  );
};

export default EdgeContextMenu;
