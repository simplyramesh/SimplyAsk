import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { getServiceTicketsStatuses } from '../../../../../../store/selectors';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { StatusOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/StatusOption';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteForm } from '../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { BULK_OPERATION_TYPES } from '../../../../constants/bulkOperations';
import { PRIORITY_OPTIONS } from '../../../../constants/options';
import { IconControl } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/controls/IconControl';
import { ISSUE_PRIORITIES } from '../../../../constants/core';

const AssigneeControl = ({ onChange }) => {
  useEffect(() => {
    onChange({ assignedToUserId: null });
  }, []);

  return <UserAutocompleteForm placeholder="Search Assignee..." onChange={onChange} />;
};

const BulkUpdateModal = ({ entity, selectedTickets, onClose, open, onUpdate }) => {
  const [value, setValue] = useState(null);

  const [statuses] = useRecoilState(getServiceTicketsStatuses);
  const statusOptions = statuses.map((status) => ({
    label: status.name,
    value: status.id,
    ...status,
  }));


  const renderControl = () => {
    switch (entity) {
      case BULK_OPERATION_TYPES.PRIORITY:
        return (
          <CustomSelect
            options={PRIORITY_OPTIONS}
            placeholder="Select priority"
            value={PRIORITY_OPTIONS.filter((priority) => priority.value === value?.priority) || ISSUE_PRIORITIES.NONE}
            getOptionValue={({ value }) => value}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            onChange={(val) => setValue({ priority: val.value })}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Control: IconControl,
              Option: IconOption,
            }}
            maxHeight={30}
            menuPadding={0}
            form
            menuPortalTarget={document.body}
          />
        );
      case BULK_OPERATION_TYPES.ASSIGNEE:
        return (
          <AssigneeControl
            onChange={(val) => {
              setValue({ assignedToUserId: val?.value?.id || null });
            }}
          />
        );
      case BULK_OPERATION_TYPES.STATUS:
        return (
          <CustomSelect
            menuPlacement="auto"
            autoFocus
            placeholder="Select Status"
            options={statusOptions}
            onChange={({ value }) => setValue({ issueStatusId: value })}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Option: StatusOption,
            }}
            menuPortalTarget={document.body}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            form
          />
        );
      default:
        return null;
    }
  };

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="600px"
      title={`Update ${entity}`}
      footerShadow={false}
      actions={
        <StyledFlex mt="12px" direction="row" justifyContent="center" width="100%" gap="20px">
          <StyledButton primary variant="outlined" minWidth="160px" onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton primary variant="contained" minWidth="160px" onClick={() => onUpdate(value)}>
            Update {entity}
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex p="30px 40px 40px" alignItems="center" gap="20px">
        <StyledFlex>
          <StyledText textAlign="center" as="span">
            <StyledText display="inline">You are about to update the priority for</StyledText>
            <StyledText
              display="inline"
              weight={600}
              as="span"
            >{` ${selectedTickets?.length} Service Tickets`}</StyledText>
          </StyledText>
          <StyledText textAlign="center">Please select {entity}</StyledText>
        </StyledFlex>

        <StyledFlex width="320px">{renderControl()}</StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default BulkUpdateModal;
