import React from 'react';
import { components } from 'react-select';

import ExpandMoreIcon from '../../../../../../Assets/icons/expandMore.svg?component';
import { StyledFlex } from '../../../../styles/styled';
import ServiceTicketStatus from '../../../../../Issues/components/ServiceTickets/components/shared/ServiceTicketStatus/ServiceTicketStatus';
import Spinner from '../../../../Spinner/Spinner';
import { StyledSpinnerWrapper } from './styled';

export const StatusValue = ({ getValue, selectProps, ...props }) => {
  const value = getValue()?.[0].label;
  const colour = props.data.colour;

  return (
    <components.SingleValue {...props}>
      <ServiceTicketStatus color={colour}>
        {value}
        {selectProps.isCustomSingleValueUpdating && (
          <StyledSpinnerWrapper>
            <Spinner inline extraSmall />
          </StyledSpinnerWrapper>
        )}
        <StyledFlex
          className="showOnRowHover"
          display={selectProps.isDropdownnIconVisible || selectProps.menuIsOpen ? 'flex' : 'none'}
        >
          <ExpandMoreIcon />
        </StyledFlex>
      </ServiceTicketStatus>
    </components.SingleValue>
  );
};
