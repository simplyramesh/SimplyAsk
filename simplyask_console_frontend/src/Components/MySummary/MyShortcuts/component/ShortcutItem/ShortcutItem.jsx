import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledShortcutIcon, StyledShortcutItem, StyledShortcutLabel } from './StyledShortcutItem';
import { useDeleteShortcut } from '../../../../../hooks/shortcuts/useDeleteShortcut';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../shared/styles/styled';

const ICON_COLOR_DATA = {
  MY_SUMMARY: 'grey',
  BOA_DASHBOARD: 'grey',
  CONVERSE_DASHBOARD: '',
  TEST_DASHBOARD: 'grey',
  CONVERSE: 'yellow',
  SERVE: 'red',
  FLOW: 'violet',
  RESOLVE: 'marinerBlue',
  TEST: 'easternBlue',
  MIGRATE: 'greenOnion',
  SETTINGS: 'grey',
  WEB_PAGES: 'grey',
  FILE_MANAGER: 'grey',
  SUPPORT: 'grey',
  OPEN_CLOSE: 'grey',
  SIMPLY_ASK: 'grey',
  SEARCH: 'grey',
};

const ShortcutItem = ({ editable, shortcut, handleSelect }) => {
  const { colors, statusColors } = useTheme();
  const type = ICON_COLOR_DATA[shortcut?.icon] || 'grey';

  const { removeShortcut, isLoading } = useDeleteShortcut();

  const remove = () => {
    removeShortcut(shortcut?.id);
  };
  const select = () => {
    if (typeof handleSelect === 'function') {
      handleSelect(shortcut);
    }
  };

  return (
    <StyledShortcutItem onClick={select}>
      <StyledShortcutIcon
        icon={shortcut?.icon}
        color={statusColors?.[type]?.color}
        background={statusColors?.[type]?.bg}
      />
      <StyledShortcutLabel>{shortcut?.label}</StyledShortcutLabel>
      {editable && (
        <StyledTooltip
          title="Delete"
          arrow
          placement="top"
          p="3px 15px"
          size="12px"
          lh="1.5"
          weight="500"
          radius="25px"
        >
          {isLoading ? (
            <StyledFlex alignItems="flex-end">
              <Spinner extraSmall inline />
            </StyledFlex>
          ) : (
            <CustomTableIcons
              icon="BIN"
              width={20}
              padding="5px"
              colorHover={colors.statusOverdue}
              bgColorHover={colors.statusOverdueBackground}
              radius="50%"
              onClick={remove}
            />
          )}
        </StyledTooltip>
      )}
    </StyledShortcutItem>
  );
};

export default memo(ShortcutItem);

ShortcutItem.propTypes = {
  shortcut: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.string,
    label: PropTypes.string,
    order: PropTypes.number,
  }),
  editable: PropTypes.bool,
  handleRemove: PropTypes.func,
  handleSelect: PropTypes.func,
};
