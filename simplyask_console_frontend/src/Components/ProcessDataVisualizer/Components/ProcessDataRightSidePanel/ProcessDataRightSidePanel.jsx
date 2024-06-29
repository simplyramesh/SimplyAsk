import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import {
  StyledDivider, StyledFlex, StyledText,
} from '../../../shared/styles/styled';

const ProcessDataRightSidePanel = ({ data, getDisplayName }) => {
  const { currentUser } = useGetCurrentUser();

  const infoListNameStyles = { wrap: 'nowrap' };

  return (
    <StyledFlex gap="15px" padding="35px 12px 30px 0">
      <StyledFlex padding="0 13px">
        <InfoListGroup title="Details" noPaddings>
          <InfoListItem name="Name" nameStyles={infoListNameStyles}>{data?.extractName}</InfoListItem>
          <InfoListItem name="Process Name" nameStyles={infoListNameStyles}>{getDisplayName(data)}</InfoListItem>
          <InfoListItem name="Created Date" alignItems="center" nameStyles={infoListNameStyles}>
            <StyledFlex>
              <StyledText
                as="p"
                lh={20}
                textAlign="right"
              >
                {getInFormattedUserTimezone(data?.createdAt, currentUser?.timezone, BASE_DATE_FORMAT) || '-'}
              </StyledText>
              <StyledText
                as="p"
                lh={20}
                textAlign="right"
              >
                {getInFormattedUserTimezone(data?.createdAt, currentUser?.timezone, BASE_TIME_FORMAT) || '-'}
              </StyledText>
            </StyledFlex>
          </InfoListItem>
        </InfoListGroup>
      </StyledFlex>

      <StyledDivider m="10px 0 20px 0" borderWidth={3} />

      <StyledFlex padding="0 13px">
        <InfoListGroup title="Parameters" noPaddings>
          {data?.processInputParams
            ?.map((item) => Object.keys(item)?.map((obj, i) => (
              <InfoListItem
                key={i}
                name={obj}
                nameStyles={infoListNameStyles}
              >
                {item[obj]}
              </InfoListItem>
            )))}
        </InfoListGroup>

      </StyledFlex>
    </StyledFlex>
  );
};

export default ProcessDataRightSidePanel;
