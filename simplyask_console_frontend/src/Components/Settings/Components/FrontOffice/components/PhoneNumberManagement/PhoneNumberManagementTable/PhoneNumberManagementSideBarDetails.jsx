
import { useNavigate } from 'react-router-dom';
import routes from '../../../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { capitalizeFirstLetterOfRegion, formatPhoneNumberCode } from '../../../../../../../utils/helperFunctions';
import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../../../../../utils/timeUtil';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoList from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';


export const PhoneNumberManagementSideBarDetails = ({ rowDataDetails }) => {
  const navigate = useNavigate();
  const { currentUser } = useGetCurrentUser();


  return (
    <InfoList p="30px">
      <InfoListGroup title="Number Details" noPaddings>
        <InfoListItem name="Country" alignItems="center">
          {rowDataDetails?.country} {formatPhoneNumberCode(rowDataDetails?.phoneNumber)}
        </InfoListItem>
        <InfoListItem name="Province" alignItems="center">
          {rowDataDetails?.province}
        </InfoListItem>
        <InfoListItem name="Area Code" alignItems="center">
          {capitalizeFirstLetterOfRegion(rowDataDetails?.areaCode)}
        </InfoListItem>
        <InfoListItem name="Date Created" alignItems="center">
          {getInFormattedUserTimezone(rowDataDetails?.createdDate, currentUser?.timezone, BASE_DATE_FORMAT)}
        </InfoListItem>
        <InfoListItem name="Assigned Agent" alignItems="center">
          {rowDataDetails?.agents?.length ? (<StyledButton
            weight={600}
            variant="text"
            onClick={() => navigate(routes.AGENT_MANAGER, { state: { name: rowDataDetails?.agents[0].name } })}
            key={rowDataDetails?.agents[0].agentId}
            minWidth="auto">
            {rowDataDetails?.agents[0].name ? rowDataDetails?.agents[0].name : '---'}
          </StyledButton>) : ('---')}
        </InfoListItem>
        <InfoListItem name="Associated Processes" alignItems="center">
          {rowDataDetails?.workflowIds?.length ? (
            rowDataDetails.workflowIds.map((item, index) => (
              <StyledButton
                weight={600}
                variant="text"
                onClick={() => navigate(routes.PROCESS_MANAGER, { state: { name: item.name } })}
                key={index}
                minWidth="auto">
                {item.name }
              </StyledButton>
            ))
          ) : ('---')}
        </InfoListItem>
      </InfoListGroup>
    </InfoList>

  );
}

export default PhoneNumberManagementSideBarDetails