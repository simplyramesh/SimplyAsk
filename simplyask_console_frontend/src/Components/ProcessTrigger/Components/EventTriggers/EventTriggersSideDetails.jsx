import React from 'react';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledDivider, StyledEmptyValue, StyledFlex, StyledText } from '../../../shared/styles/styled';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import InfoList from '../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import { getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { EVENT_PAYLOAD_MAPPING_COLUMNS } from '../../utils/formatters';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { WEBHOOK_DOCUMENTATION_URL } from '../../../../utils/constants';
import { useNavigate } from 'react-router';
import routes from '../../../../config/routes';

const EventTriggersSideDetails = ({ eventTrigger, toggleSidebar }) => {
  const { currentUser } = useGetCurrentUser();
  const navigate = useNavigate();
  const timezone = currentUser?.timezone;

  return (
    <CustomSidebar
      width={1000}
      open={!!eventTrigger}
      onClose={() => toggleSidebar('details', false)}
      headerTemplate={
        <StyledFlex gap="10px">
          <StyledFlex direction="row" alignItems="center" gap="10px">
            <StyledText weight={600} size={24}>
              {eventTrigger?.name}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      }
      customHeaderActionTemplate={
        <StyledFlex direction="row" alignItems="center">
          <StyledButton
            primary
            variant="contained"
            onClick={() => navigate(`${routes.EVENT_TRIGGER_DETAILS}/${eventTrigger?.webhookId}`)}
            startIcon={<OpenIcon fontSize="inherit" />}
          >
            Edit Event Trigger
          </StyledButton>
        </StyledFlex>
      }
    >
      {() => (
        <>
          <InfoList p="30px 16px">
            <InfoListGroup noPaddings title="Details">
              <InfoListItem name="Filter Expression" alignItems="start">
                {eventTrigger?.filterExpression}
              </InfoListItem>
              <InfoListItem name="Process" alignItems="center">
                {eventTrigger?.process?.displayName}
              </InfoListItem>
              <InfoListItem name="Environment" alignItems="center">
                {eventTrigger?.environment?.envName || <StyledEmptyValue />}
              </InfoListItem>
              <InfoListItem name="Last Updated" alignItems="center">
                {eventTrigger?.updatedAt ? (
                  getInFormattedUserTimezone(eventTrigger.updatedAt, timezone)
                ) : (
                  <StyledEmptyValue />
                )}
              </InfoListItem>
              <InfoListItem name="Created On" alignItems="center">
                {eventTrigger?.createdAt ? (
                  getInFormattedUserTimezone(eventTrigger.createdAt, timezone)
                ) : (
                  <StyledEmptyValue />
                )}
              </InfoListItem>
            </InfoListGroup>
            <StyledDivider borderWidth={1} m="0 0 15px" />
            <StyledFlex alignItems="start" ml="14px">
              <StyledButton
                variant="text"
                startIcon={<OpenIcon />}
                onClick={() => {
                  window.open(WEBHOOK_DOCUMENTATION_URL, '_blank');
                }}
              >
                <StyledText weight={600} lh={20} color="inherit" wrap="nowrap">
                  How to Trigger Webhooks
                </StyledText>
              </StyledButton>
            </StyledFlex>
            <StyledDivider height={80} borderWidth={2} m="30px 0" />
          </InfoList>
          <StyledText ml={30} mb={56} size={19} weight={600}>
            Event Payload Mapping
          </StyledText>

          <TableV2
            data={{ content: eventTrigger?.parameters }}
            columns={EVENT_PAYLOAD_MAPPING_COLUMNS}
            enableRowSelection={false}
            enableSearch={false}
            enableShowFiltersButton={false}
            enableFooter={false}
            enableHeader={false}
          />
        </>
      )}
    </CustomSidebar>
  );
};

export default EventTriggersSideDetails;
