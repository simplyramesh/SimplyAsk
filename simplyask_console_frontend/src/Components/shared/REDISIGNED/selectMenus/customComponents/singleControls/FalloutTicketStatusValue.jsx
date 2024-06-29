import { InfoOutlined } from '@mui/icons-material';
import React from 'react';
import { components } from 'react-select';
import ExpandMoreIcon from '../../../../../../Assets/icons/expandMore.svg?component';
import {
  FALLOUT_TICKET_STATUS_TOOLTIPS,
  STATUS_CONSTANTS,
} from '../../../../../Issues/components/FalloutTickets/constants/constants';
import ServiceTicketStatus from '../../../../../Issues/components/ServiceTickets/components/shared/ServiceTicketStatus/ServiceTicketStatus';
import { StyledFlex } from '../../../../styles/styled';
import { StyledTooltip } from '../../../tooltip/StyledTooltip';

export const FalloutTicketStatusValue = ({ getValue, selectProps, ...props }) => {
  const value = getValue()?.[0].label;
  const colour = props.data.colour;

  const isTicketResolved = STATUS_CONSTANTS.RESOLVED === value;

  return (
    <components.SingleValue {...props}>
      <ServiceTicketStatus color={colour}>
        {value}
        <StyledFlex
          className="showOnRowHover"
          display={selectProps.isDropdownnIconVisible || selectProps.menuIsOpen ? 'flex' : 'none'}
          alignItems="center"
        >
          {isTicketResolved ? (
            <StyledTooltip
              title={FALLOUT_TICKET_STATUS_TOOLTIPS[STATUS_CONSTANTS.RESOLVED]}
              arrow
              placement="bottom"
              p="10px 15px"
              maxWidth="450px"
            >
              <InfoOutlined sx={{ width: '19px', margin: '0 0 2px 5px' }} />
            </StyledTooltip>
          ) : (
            <ExpandMoreIcon />
          )}
        </StyledFlex>
      </ServiceTicketStatus>
    </components.SingleValue>
  );
};
