import React from 'react';

import InfoTable from '../../../../../shared/REDISIGNED/layouts/InfoTable/InfoTable';
import InfoTableItem from '../../../../../shared/REDISIGNED/layouts/InfoTable/InfoTableItem';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { shortcuts } from '../../utils/data';

const ShortcutsSidebar = ({ sidebarOpened, setSidebarOpened }) => {
  return (
    <CustomSidebar
      open={!!sidebarOpened}
      headStyleType="filter"
      onClose={() => setSidebarOpened(false)}
      sx={{
        zIndex: 1400,
      }}
    >
      {() => (
        <StyledFlex p="24px">
          <StyledText weight={600} size={20} lh={20} mb={34}>
            Help - Keyboard Shortcuts
          </StyledText>
          <StyledText weight={600} size={15} lh={20} mb={10}>
            Common actions
          </StyledText>
          <InfoTable>
            {shortcuts.map((item, index) => (
              <InfoTableItem key={index} name={item.left}>{item.right}</InfoTableItem>
            ))}
          </InfoTable>
        </StyledFlex>
      )}
    </CustomSidebar>
  );
};

export default ShortcutsSidebar;
