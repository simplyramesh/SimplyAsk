import { useTheme } from '@emotion/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { SvgIcon } from '@mui/material';
import PropTypes from 'prop-types';
import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { StyledPopoverActionsBtn } from '../../../../../Issues/components/ServiceTickets/components/shared/TicketDetailsAttachments/TicketDetailsAttachedFile/TicketDetailsAttachedFile';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TrashBinIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import { StyledFlex, StyledPopover, StyledText } from '../../../../../shared/styles/styled';
import CloseIcon from '../../../../Assets/Icons/closeIcon.svg?component';
import LeftArrowIcon from '../../../../Assets/Icons/leftArrow.svg?component';
import {
  StyledArrowIconWrapper,
  StyledCloseIconWrapper,
  StyledDynamicMenuHeader,
  StyledDynamicMenuHeaderWrapper,
  StyledMoreVertBtn,
} from '../StyledSideMenuModule';

const SideMenuHeader = ({
  text,
  withColor,
  onClose,
  onArrowClick,
  arrowIcon,
  children,
  promptText,
  onRemoveStepClick,
}) => {
  const { colors } = useTheme();

  const {
    id: idMoreActionsPopover,
    open: openMoreActionsPopover,
    anchorEl: anchorElMoreActionsPopover,
    handleClick: handleClickMoreActionsPopover,
    handleClose: handleCloseMoreActionsPopover,
  } = usePopoverToggle('sidebar-more-actions');

  const getMoreActionsPopover = () => (
    <StyledPopover
      id={idMoreActionsPopover}
      open={openMoreActionsPopover}
      anchorEl={anchorElMoreActionsPopover}
      onClose={handleCloseMoreActionsPopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPopover-paper': {
          overflow: 'hidden',
        },
        '&': {
          zIndex: 5002,
        },
      }}
    >
      <StyledFlex overflow="hidden">
        <StyledPopoverActionsBtn onClick={onRemoveStepClick}>
          <StyledFlex cursor="pointer" p="7px 16px" direction="row" gap="10px" alignItems="center" width="141px">
            <SvgIcon
              component={TrashBinIcon}
              sx={{
                position: 'absolute',
                bottom: '11px',
                width: '19px',
                height: '19px',
                left: '14px',
                color: colors.primary,
              }}
            />
            <StyledText ml={26}>Delete</StyledText>
          </StyledFlex>
        </StyledPopoverActionsBtn>
      </StyledFlex>
    </StyledPopover>
  );

  return (
    <StyledDynamicMenuHeaderWrapper withColor={withColor}>
      {(onClose || text) && (
        <StyledDynamicMenuHeader>
          {onClose && (
            <StyledCloseIconWrapper onClick={onClose}>
              <CloseIcon />
            </StyledCloseIconWrapper>
          )}
          {text && <InputLabel label={text} size={16} weight={600} hint={promptText} p="0 20px 0 0" />}

          {onRemoveStepClick && (
            <>
              <StyledMoreVertBtn onClick={handleClickMoreActionsPopover}>
                <MoreVertIcon
                  sx={{
                    width: '29px',
                    height: '29px',
                  }}
                />
              </StyledMoreVertBtn>
              {getMoreActionsPopover()}
            </>
          )}
        </StyledDynamicMenuHeader>
      )}

      {arrowIcon && (
        <StyledArrowIconWrapper onClick={onArrowClick}>
          <LeftArrowIcon />
        </StyledArrowIconWrapper>
      )}
      {children}
    </StyledDynamicMenuHeaderWrapper>
  );
};

export default SideMenuHeader;

SideMenuHeader.propTypes = {
  text: PropTypes.string,
  withColor: PropTypes.bool,
  onArrowClick: PropTypes.func,
  closeIcon: PropTypes.bool,
  arrowIcon: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  promptText: PropTypes.string,
};
