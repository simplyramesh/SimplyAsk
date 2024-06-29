import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';

import SideModalFilterContent from '../../../Settings/AccessManagement/components/modals/sideModals/SideModalFilterContent/SideModalFilterContent';
import NoDataFound, { NO_DATA_MY_SUMMARY_TEXTS } from '../../../shared/NoDataFound/NoDataFound';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../shared/Spinner/Spinner';
import { StyledText } from '../../../shared/styles/styled';
import ShortcutsManage from '../ShortcutsManage/ShortcutsManage';
import { StyledMyShortcutsHeader, StyledMyShortcutsPart, StyledShortcutsSection } from './StyledShortcutsSection';
import RecentlyViewed from '../RecentlyViewed/RecentlyViewed';
import { DragDropContext } from 'react-beautiful-dnd';
import { GET_SHORTCUTS, useShortcuts } from '../../../../hooks/shortcuts/useShortcuts';
import { useRecoilValue } from 'recoil';
import { mappedGrantedPagesSelector } from '../../../../store/selectors';
import { getShortcutInfo } from '../../helpers';
import { useNavigate } from 'react-router-dom';
import { useBulkUpdateShortcut } from '../../../../hooks/shortcuts/useBulkUpdateShortcut';
import { useQueryClient } from '@tanstack/react-query';
import { StyledShortcutList } from '../component/ShortcutList/StyledShortcutList';
import ShortcutItem from '../component/ShortcutItem/ShortcutItem';

const ShortcutsSection = () => {
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [editShortcuts, setEditShortcuts] = useState(false);
  const { shortcuts, isShortcutsLoading, isShortcutsFetching } = useShortcuts();
  const grantedPages = useRecoilValue(mappedGrantedPagesSelector);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const { bulkUpdateShortcuts } = useBulkUpdateShortcut();

  const mappedShortcuts = shortcuts
    .map((item, index) => getShortcutInfo(item.url, index, grantedPages, item.shortcutId, item.order))
    .sort((a, b) => a.order - b.order);

  const handleShortcutClick = (url) => {
    navigate(url);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(mappedShortcuts, result.source.index, result.destination.index).map((item, index) => ({
      id: item.id,
      pageUrl: item.urlKey,
      order: index,
    }));

    queryClient.setQueryData([GET_SHORTCUTS], (old) => old?.map((item) => ({
      ...item,
      order: items.find((i) => i.id === item.shortcutId)?.order,
    }))
    );

    bulkUpdateShortcuts(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StyledShortcutsSection isLoading={isShortcutsLoading}>
        {isShortcutsLoading  ? (
          <Spinner medium />
        ) : (
          <>
            <RecentlyViewed />
            <StyledMyShortcutsPart>
              <StyledMyShortcutsHeader>
                <StyledText size={16} lh={20} weight={700}>
                  My Shortcuts
                </StyledText>
                {!isShortcutsLoading && (
                  <StyledTooltip
                    title="Manage Shortcuts"
                    arrow
                    placement="top"
                    p="3px 15px"
                    size="12px"
                    lh="1.5"
                    weight="500"
                    radius="25px"
                  >
                    <CustomTableIcons
                      icon="SETTINGS_2"
                      width={26}
                      padding="5px"
                      bgColor={colors.tertiary}
                      bgColorHover={colors.tertiaryHover}
                      radius="50%"
                      onClick={() => setEditShortcuts(!editShortcuts)}
                    />
                  </StyledTooltip>
                )}
              </StyledMyShortcutsHeader>

              {mappedShortcuts?.length > 0 ? (
                <StyledShortcutList customStyle={{ maxHeight: '446px' }}>
                  {isShortcutsFetching && <Spinner parent fadeBgParent small />}
                  {
                    mappedShortcuts.map((item, index) => (
                      <ShortcutItem
                        shortcut={item}
                        handleSelect={(item) => handleShortcutClick?.(item?.urlKey)}
                        key={index}
                      />
                    ))
                  }
                </StyledShortcutList>
              ) : (
                <NoDataFound
                  title={NO_DATA_MY_SUMMARY_TEXTS.NO_DATA_SHORTCUTS.title}
                  link="Add a Shortcut"
                  handleClickLink={() => setEditShortcuts(true)}
                  customStyle={{
                    wrapperPadding: '0 2rem',
                    minHeight: '266px',
                    titleFontSize: '16px',
                    titleLineHeight: '16px',
                    iconSize: '66px',
                  }}
                />
              )}
            </StyledMyShortcutsPart>
          </>
        )}
      </StyledShortcutsSection>

      {/* modals */}
      <SideModalFilterContent isModalOpen={editShortcuts} width={500} onModalClose={() => setEditShortcuts(false)}>
        <ShortcutsManage data={mappedShortcuts} isShortcutsFetching={isShortcutsFetching} />
      </SideModalFilterContent>
    </DragDropContext >
  );
};

export default ShortcutsSection;

ShortcutsSection.propTypes = {};
