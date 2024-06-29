import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useCreateActivity } from '../../../../../../hooks/activities/useCreateActivitiy';
import { getServiceTicketsCategory } from '../../../../../../store/selectors';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StatusOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/StatusOption';
import { StatusValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/StatusValue';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { SERVICE_TICKET_FIELDS_TYPE, useOptimisticIssuesUpdate } from '../../../../hooks/useOptimisticIssuesUpdate';
import { SERVICE_TICKETS_STATUSES } from '../../constants/initialValues';

const RenderStatusEdit = React.memo(
  ({ cell, row, table }) => {
    const category = useRecoilValue(getServiceTicketsCategory);
    const serviceTicketTypes = category?.types;

    const [oldStatus, setOldStatus] = useState();
    const { key, user } = table.options.meta;

    const { status: cellVal, isDeleting, isUpdating } = cell.getValue() || {};

    const ticketType = serviceTicketTypes.find((type) => type.name === row.original.issueType);
    const statuses = ticketType?.statuses.map((status) => ({
      label: status.name,
      value: status.id,
      ...status,
    }));

    const value = statuses?.find((status) => status.label === cellVal);
    const issue = row.original;

    const { createStatusChangedActivity } = useCreateActivity();

    const { mutate, isLoading } = useOptimisticIssuesUpdate({
      queryKey: key,
      type: SERVICE_TICKET_FIELDS_TYPE.STATUS,
      customOnSuccess: (data) => {
        createStatusChangedActivity({
          issueId: issue.id,
          oldStatus,
          newStatus: data[0].status,
          userId: user.id,
        });
      },
    });

    const handleStatusChange = (status) => {
      setOldStatus(cellVal);
      const payload = {
        dueDate: issue.dueDate,
        issueId: issue.id,
        assignedToUserId: issue.assignedTo?.id || null,
        issueStatusId: status.value,
        newStatus: status.label,
        resolvedBy:
          status.label === SERVICE_TICKETS_STATUSES.DONE || status.label === SERVICE_TICKETS_STATUSES.RESOLVED
            ? 'USER'
            : null,
      };
      mutate(payload);
      table.setEditingCell(null);
    };

    if (isDeleting || isUpdating) return <Skeleton />;

    return (
      <StyledFlex p="0 8px">
        <CustomSelect
          menuPlacement="auto"
          options={statuses?.filter((status) => status !== value)}
          placeholder={null}
          onChange={handleStatusChange}
          onBlur={() => table.setEditingCell(null)}
          value={value}
          components={{
            DropdownIndicator: null,
            Option: StatusOption,
            SingleValue: StatusValue,
          }}
          menuPortalTarget={document.body}
          isSearchable={false}
          cell
          status
          closeMenuOnSelect
          isCustomSingleValueUpdating={isLoading}
        />
      </StyledFlex>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RenderStatusEdit;
