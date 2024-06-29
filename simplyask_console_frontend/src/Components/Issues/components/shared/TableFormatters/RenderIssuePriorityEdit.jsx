import React from 'react';
import { useCreateActivity } from '../../../../../hooks/activities/useCreateActivitiy';
import { IconOption } from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { IconValue } from '../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/IconValue';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { ISSUE_PRIORITIES } from '../../../constants/core';
import { PRIORITY_OPTIONS } from '../../../constants/options';
import { SERVICE_TICKET_FIELDS_TYPE, useOptimisticIssuesUpdate } from '../../../hooks/useOptimisticIssuesUpdate';

const RenderIssuePriorityEdit = ({ cell, table, row }) => {
  const { user, key } = table.options.meta;
  const { createActionPerformedActivity } = useCreateActivity();
  const { priority: value } = cell.getValue();

  const val = value
    ? PRIORITY_OPTIONS.find((priority) => priority.value === value)
    : PRIORITY_OPTIONS[ISSUE_PRIORITIES.NONE];

  const issue = row.original;

  const { mutate } = useOptimisticIssuesUpdate({
    queryKey: key,
    type: SERVICE_TICKET_FIELDS_TYPE.PRIORITY,
    customOnSuccess: (data) => {
      createActionPerformedActivity({
        issueId: issue.id,
        oldValue: value,
        newValue: `Priority updated to ${data[0].priority}`,
        userId: user.id,
      });
    },
  });

  const handlePriorityChange = (priority) => {
    mutate({
      dueDate: issue.dueDate,
      issueId: issue.id,
      assignedToUserId: issue.assignedTo?.id || null,
      priority: priority.value,
    });
    table.setEditingCell(null);
  };

  return (
    <CustomSelect
      menuPlacement="auto"
      autoFocus
      options={PRIORITY_OPTIONS.filter((option) => option !== val)}
      defaultMenuIsOpen
      placeholder={null}
      value={val}
      getOptionValue={({ value }) => value}
      closeMenuOnSelect
      isClearable={false}
      isSearchable={false}
      onChange={handlePriorityChange}
      onBlur={() => table.setEditingCell(null)}
      components={{
        DropdownIndicator: null,
        SingleValue: IconValue,
        Option: IconOption,
      }}
      maxHeight={30}
      menuPadding={0}
      cell
      controlTextHidden
      menuPortalTarget={document.body}
    />
  );
};

export default RenderIssuePriorityEdit;
