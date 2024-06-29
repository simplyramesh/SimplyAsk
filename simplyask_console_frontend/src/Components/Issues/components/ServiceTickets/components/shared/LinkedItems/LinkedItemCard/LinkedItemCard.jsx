import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { noop } from 'lodash';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';

import routes from '../../../../../../../../config/routes';
import { useUser } from '../../../../../../../../contexts/UserContext';
import { useCreateActivity } from '../../../../../../../../hooks/activities/useCreateActivitiy';
import { useUpdateLinkedItem } from '../../../../../../../../hooks/service-tickets/useUpdateLinkedItem';
import { useGetCurrentUser } from '../../../../../../../../hooks/useGetCurrentUser';
import { getServiceTicketsCategory } from '../../../../../../../../store/selectors';
import { transformToSelectOptions } from '../../../../../../../../utils/functions/transformToSelectOptions';
import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../../../../utils/timeUtil';
import { PROCESS_STATUS_COLORS_MAP } from '../../../../../../../ProcessHistory/constants/core';
import ServiceTypeIconPreview from '../../../../../../../Settings/Components/FrontOffice/components/shared/ServiceTypeIconPreview';
import UserAvatar from '../../../../../../../UserAvatar';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StatusOption } from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/StatusOption';
import { StatusValue } from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/StatusValue';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledFlex,
  StyledHoverDiv,
  StyledHoverText,
  StyledLink,
  StyledStatus,
  StyledText,
} from '../../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_RELATIONS, ISSUE_ENTITY_TYPE } from '../../../../../../constants/core';
import { getLinkedItemIdByLinkType, getLinkedItemUrlByLinkType } from '../../../../utils/helpers';
import LinkedItemIcon from '../LinkedItemIcon/LinkedItemIcon';

const CloseIconButton = styled(IconButton)`
  border-radius: 5px;
  padding: 8px 4px;
  color: #949ca5;

  &:hover {
    background-color: #e2e7f0;
  }
`;

const LinkedItemCard = ({
  item,
  onUnlink,
  closeTooltipText = 'Unlink',
  relation,
  ticketId,
  isLinkedClickable = false,
  onClick,
}) => {
  const { type, name, description, createdDate, status, relatedEntity } = item;
  const params = useParams();
  const location = useLocation();
  const { issueType = null } = relatedEntity || {};
  const { boxShadows } = useTheme();
  const { currentUser } = useGetCurrentUser();
  const { user } = useUser();
  const [{ types: serviceTicketTypes }] = useRecoilState(getServiceTicketsCategory);

  const serviceTicketType = serviceTicketTypes.find((el) => issueType === el.name);

  const statusesData = transformToSelectOptions(serviceTicketTypes.find((el) => issueType === el.name)?.statuses);

  const getCustomName = (linkedItemType, entity) => {
    if (linkedItemType !== ISSUE_ENTITY_TYPE.ISSUE) {
      return { firstName: '', lastName: '' };
    }

    const fullName = entity?.assignedTo?.name || '';
    const [firstName = '', lastName = ''] = fullName.split(' ');

    return { firstName, lastName };
  };

  const statusValue = statusesData.find((statusData) => statusData.label === status);
  const options = statusesData.filter(({ name: statusName }) => statusName !== status);
  const { createStatusChangedActivity, isFalloutLoading } = useCreateActivity();

  const { updateServiceTicket, isServiceTicketLoading } = useUpdateLinkedItem();

  const handleLinkClick = () => {
    if (onClick) {
      onClick();
    } else {
      const itemId = getLinkedItemIdByLinkType(type, relatedEntity);
      const url = getLinkedItemUrlByLinkType(type, itemId);
      if (url) {
        window.open(url, '_blank');
      }
    }
  };

  const handleOnStatusClick = (e) => {
    e.stopPropagation();
  };

  const handleChangeStatus = (status) => {
    if (!item?.relatedEntity) {
      return toast.error('Something went wrong');
    }

    createStatusChangedActivity({
      issueId: item?.relatedEntity.id,
      oldStatus: item?.relatedEntity.status?.toUpperCase(),
      newStatus: status.name.toUpperCase(),
      userId: user?.id,
    });

    updateServiceTicket({
      ticket: item?.relatedEntity,
      issueStatusId: status.id,
      newStatus: status.name,
      relatedEntityId: item.id,
      ticketId,
    });
  };

  const isStatusUpdating = isServiceTicketLoading || isFalloutLoading;

  const handleDeleteLinkedItem = (e) => {
    onUnlink?.(item);
    e.stopPropagation();
  };

  const linkConfig = {
    [ISSUE_ENTITY_TYPE.ISSUE]: {
      pathname: params.ticketId ? location.pathname : `${location.pathname}/${ticketId}`,
      search: 'tab=ticketTasks',
    },
    [ISSUE_ENTITY_TYPE.PROCESS]: {
      pathname: routes.PROCESS_HISTORY,
    },
  };

  return (
    <StyledHoverDiv onClick={isLinkedClickable ? handleLinkClick : noop}>
      <StyledFlex
        alignItems="center"
        padding="2px 10px"
        justifyContent="space-between"
        boxShadow={boxShadows.linkedItemCard}
        height="50px"
        direction="row"
        borderRadius="3px"
      >
        <StyledHoverText isLinkedClickable={isLinkedClickable}>
          <StyledFlex direction="row" alignItems="center" flexShrink={1}>
            <StyledFlex width="30px" height="30px" justifyContent="center" alignItems="center" mr="10px">
              <LinkedItemIcon
                type={type}
                relatedEntity={relatedEntity}
                tooltipText={serviceTicketType?.name || null}
                customIcon={
                  type === ISSUE_ENTITY_TYPE.ISSUE ? (
                    <span>
                      <ServiceTypeIconPreview
                        icon={serviceTicketType?.icon}
                        iconColour={serviceTicketType?.iconColour}
                        wrapperWidth={30}
                        wrapperHeight={30}
                        iconHeight={14}
                        iconWidth={14}
                      />
                    </span>
                  ) : null
                }
              />
            </StyledFlex>
            <StyledFlex>
              <StyledFlex>
                <StyledLink to={linkConfig[type] || ''} onClick={(e) => e.preventDefault()}>
                  <StyledText size={15} lh={22} weight={600} maxLines={1}>
                    {name}
                    {type === ISSUE_ENTITY_TYPE.USER && relatedEntity?.isLocked ? (
                      <StyledText display="inline" size={15} lh={22} weight={600} themeColor="validationError">
                        {' (Inactive User)'}
                      </StyledText>
                    ) : null}
                  </StyledText>
                  {description && (
                    <StyledText size={13} lh={19} maxLines={1}>
                      {description}
                    </StyledText>
                  )}
                </StyledLink>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        </StyledHoverText>
        <StyledFlex flexShrink={0} direction="row" alignItems="center" ml={2}>
          {createdDate && type !== ISSUE_ENTITY_TYPE.AGENT && (
            <StyledFlex direction="row" gap="4px">
              <StyledText size={13} weight={600} wrap="nowrap">
                Created On:
              </StyledText>
              <StyledText size={13} wrap="nowrap">
                {getInFormattedUserTimezone(
                  createdDate,
                  currentUser.timezone,
                  `${BASE_DATE_FORMAT} - ${BASE_TIME_FORMAT}`
                )}
              </StyledText>
            </StyledFlex>
          )}
          {statusesData.length > 0 && (
            <StyledFlex p="0 8px" onClick={handleOnStatusClick}>
              <CustomSelect
                menuPlacement="auto"
                autoFocus
                options={options}
                placeholder={null}
                onChange={handleChangeStatus}
                value={statusValue}
                components={{
                  DropdownIndicator: null,
                  Option: StatusOption,
                  SingleValue: StatusValue,
                }}
                menuPortalTarget={document.body}
                closeMenuOnSelect
                openMenuOnClick
                isSearchable={false}
                status
                isDropdownnIconVisible
                isCustomSingleValueUpdating={isStatusUpdating}
                isDisabled={isStatusUpdating}
              />
            </StyledFlex>
          )}
          {type === ISSUE_ENTITY_TYPE.ISSUE && (
            <StyledFlex>
              <UserAvatar customUser={getCustomName(type, relatedEntity)} size={30} />
            </StyledFlex>
          )}
          {type === ISSUE_ENTITY_TYPE.PROCESS && (
            <StyledFlex ml="auto">
              <StyledStatus minWidth="unset" color={PROCESS_STATUS_COLORS_MAP[status]?.color} height="34px">
                {PROCESS_STATUS_COLORS_MAP[status]?.label}
              </StyledStatus>
            </StyledFlex>
          )}
          {relation !== ISSUE_ENTITY_RELATIONS.CHILD && (
            <StyledFlex ml="4px">
              <StyledTooltip title={closeTooltipText} arrow placement="top-end">
                <CloseIconButton onClick={handleDeleteLinkedItem}>
                  <CloseIcon />
                </CloseIconButton>
              </StyledTooltip>
            </StyledFlex>
          )}
        </StyledFlex>
      </StyledFlex>
    </StyledHoverDiv>
  );
};

export default LinkedItemCard;
