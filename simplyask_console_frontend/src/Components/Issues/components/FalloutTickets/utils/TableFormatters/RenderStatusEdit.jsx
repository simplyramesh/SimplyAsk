import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { useCreateActivity } from '../../../../../../hooks/activities/useCreateActivitiy';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { FalloutTicketStatusOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/FalloutTicketStatusOption';
import { FalloutTicketStatusValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/FalloutTicketStatusValue';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { SERVICE_TICKET_FIELDS_TYPE, useOptimisticIssuesUpdate } from '../../../../hooks/useOptimisticIssuesUpdate';
import { STATUS_CONSTANTS } from '../../constants/constants';

const RenderStatusEdit = React.memo(
  ({ cell, row, table }) => {
    const [oldStatus, setOldStatus] = useState();

    const { key, user, statusOptions } = table.options.meta;

    const { status: statusVal, isUpdating } = cell.getValue() || {};

    const issue = row.original;

    const { createStatusChangedActivity } = useCreateActivity();

    const { mutate } = useOptimisticIssuesUpdate({
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
      setOldStatus(statusVal);
      const payload = {
        dueDate: issue.dueDate,
        issueId: issue.id,
        assignedToUserId: issue.assignedTo?.id || null,
        issueStatusId: status.value,
        newStatus: status.label,
      };
      mutate(payload);
      table.setEditingCell(null);
    };

    const options =
      statusOptions?.map((status) => ({
        label: status.name,
        value: status.id,
        ...status,
      })) || [];

    const value = options?.find((status) => status.name === statusVal);

    const isTicketResolved = statusVal === STATUS_CONSTANTS.RESOLVED;

    const getSelectOptions = () =>
      isTicketResolved
        ? []
        : options.filter((status) => status.id !== value?.id && status.name !== STATUS_CONSTANTS.RESOLVED);

    if (isUpdating) return <Skeleton />;

    return (
      <StyledFlex p="0 8px">
        <CustomSelect
          menuPlacement="auto"
          options={getSelectOptions()}
          placeholder={null}
          onChange={handleStatusChange}
          onBlur={() => table.setEditingCell(null)}
          value={value}
          components={{
            DropdownIndicator: null,
            Option: FalloutTicketStatusOption,
            SingleValue: FalloutTicketStatusValue,
          }}
          menuPortalTarget={document.body}
          isSearchable={false}
          cell
          status
          closeMenuOnSelect
          menuWidth={290}
          openMenuOnClick={!isTicketResolved}
        />
      </StyledFlex>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default RenderStatusEdit;
