import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import { useLocation } from 'react-router';
import ServiceTypeIconPreview from '../../../../../Settings/Components/FrontOffice/components/shared/ServiceTypeIconPreview';
import { StyledCellHoverText, StyledFlex, StyledLink, StyledText } from '../../../../../shared/styles/styled';
import { StyledIssueTypeIcon } from '../../../../StyledIssues';
import { renderIssueTooltip } from '../../../../utills/formatters';

const RenderTicketName = React.memo(
  ({ cell, row, table, isTask }) => {
    const { name, id, type, isDeleting, isUpdating } = cell.getValue() || {};

    const location = useLocation();
    const { serviceTicketTypes, setTicketDetailsOpen } = table.options.meta;
    const ticketType = serviceTicketTypes.find((_type) => _type.name === type);

    if (isDeleting || isUpdating) return <Skeleton />;

    const handleLeftClick = (event) => {
      event.preventDefault();
      setTicketDetailsOpen?.(row.original);
    };

    return (
      <StyledCellHoverText pointer={!isTask} underline={!isTask}>
        <StyledLink
          to={`${location.pathname}/${id}`}
          onClick={handleLeftClick}
          themeColor="primary"
          themeHoverColor={isTask ? 'primary' : 'linkColor'}
          cursor={isTask ? 'default' : 'pointer'}
        >
          <StyledFlex direction="row" alignItems="center" gap="15px">
            <StyledIssueTypeIcon>
              {renderIssueTooltip(
                <ServiceTypeIconPreview iconColour={ticketType?.iconColour} icon={ticketType?.icon} />,
                ticketType?.name
              )}
            </StyledIssueTypeIcon>
            <StyledFlex>
              <StyledText color="inherit" size="15px" weight={600}>
                {name}
              </StyledText>
              <StyledText color="inherit" size="13px" weight={400}>
                {id}
              </StyledText>
            </StyledFlex>
          </StyledFlex>
        </StyledLink>
      </StyledCellHoverText>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderTicketName;
