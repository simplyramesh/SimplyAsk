import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import useGetIssues from '../../../../../../../hooks/issue/useGetIssues';
import { getConversationHistory } from '../../../../../../../Services/axios/conversationHistoryAxios';
import { getUserByUserId } from '../../../../../../../Services/axios/processHistory';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import EmptyTable from '../../../../../../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledAvatar, StyledCard, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_TYPE } from '../../../../../constants/core';
import { getFirstOrFullNameInitials } from '../../../../TicketTasks/utills/helpers';
import ConversationHistoryItem from './ConversationHistoryItem/ConversationHistoryItem';

const ConversationHistoryTab = () => {
  const { colors } = useTheme();
  const { ticketId: id } = useParams();

  const { issues: agentInfo, isFetching: isFetchingAgentInfo } = useGetIssues({
    queryKey: ['getRelatedAgents'],
    filterParams: {
      issueId: id,
      returnAdditionalField: true,
      returnRelatedEntities: true,
    },
    issueCategory: 'Service Ticket',
    options: {
      enabled: !!id,
      select: (data) => {
        const relatedEntities = data?.content?.[0]?.relatedEntities;
        const { userSessionId } = relatedEntities?.reduce((acc, curr) => {
          if (curr?.type === ISSUE_ENTITY_TYPE.AGENT) return { ...acc, userSessionId: curr?.typeEntityId };

          return acc;
        }, {});

        return {
          userSessionId,
        };
      },
    },
  });

  const { data: conversationHistory, isFetching: isFetchingConversationHistory } = useQuery({
    queryKey: ['getConversationHistory', agentInfo?.userSessionId],
    queryFn: () => getConversationHistory(agentInfo?.userSessionId),
    enabled: !!agentInfo?.userSessionId,
    select: (data) => {
      const userId = data?.reduce((acc, curr) => {
        if (curr?.messageSource === ISSUE_ENTITY_TYPE.USER) return curr?.message?.contents?.fromId;

        return acc;
      }, '');

      return {
        data,
        userId,
      };
    },
  });

  const { data: userData, isFetching: isFetchingUserData } = useQuery({
    queryKey: ['getUserData', conversationHistory?.userId],
    queryFn: () => getUserByUserId(conversationHistory?.userId),
    enabled: !!conversationHistory?.userId,
    select: (data) => {
      const addComma = data?.city && data?.billingCountry?.name ? ', ' : '';

      return {
        email: data?.email,
        name: data?.fullname,
        phone: data?.phone,
        location: `${data?.city || ''}${addComma}${data?.billingCountry?.name || ''}`,
      };
    },
  });

  if (isFetchingConversationHistory && isFetchingAgentInfo && isFetchingUserData) return <Spinner parent />;

  const renderCardTitle = (title) => (
    <StyledText size={18} weight={600}>
      {title}
    </StyledText>
  );

  const renderPersonInfo = (icon, text) => (
    <StyledFlex direction="row" gap="0 15px">
      <CustomTableIcons icon={icon || 'EMAIL'} width={20} />
      <StyledText size={14} weight={400} cursor="inherit">
        {text}
      </StyledText>
    </StyledFlex>
  );

  const renderAvatar = (name, isAgent) => {
    return (
      <StyledAvatar
        width="40px"
        fontSize="14px"
        fontWeight="500"
        bgColor={isAgent ? colors.primary : colors.secondary}
        color={colors.white}
      >
        {getFirstOrFullNameInitials(name)}
      </StyledAvatar>
    );
  };

  return (
    <>
      {conversationHistory ? (
        <StyledFlex direction={{ md: 'column', lg: 'row' }} gap="0 53px">
          <StyledFlex flex="1 1 auto">
            <StyledCard>
              <StyledFlex p="10px 18px 50px 18px" gap="22px 0">
                {renderCardTitle('Conversation History')}
                {conversationHistory?.data?.map((data) => (
                  <ConversationHistoryItem key={data?.id} data={data} />
                ))}
              </StyledFlex>
            </StyledCard>
          </StyledFlex>

          <StyledFlex>
            <StyledFlex flex="1 0 auto" minWidth="364px">
              <StyledCard>
                <StyledFlex p="10px 11px 19px 11px">
                  <StyledFlex m="0 0 21px 6px">{renderCardTitle('Person')}</StyledFlex>

                  {userData ? (
                    <>
                      <StyledFlex direction="row" mb="32px" gap="0 13px" alignItems="center">
                        {renderAvatar(userData?.name, false)}
                        <StyledText size={18} weight={500}>
                          {userData?.name}
                        </StyledText>
                      </StyledFlex>

                      <StyledFlex ml="6px">
                        <StyledFlex gap="18px 0" mb="21px">
                          {renderPersonInfo('EMAIL', userData?.email)}
                          {renderPersonInfo('PHONE', userData?.phone)}
                          {renderPersonInfo('LOCATION', userData?.location)}
                        </StyledFlex>

                        <StyledButton
                          variant="text"
                          sx={{
                            textAlign: 'left',
                            border: 'none',
                            alignSelf: 'flex-start',
                          }}
                          disableRipple
                          onClick={() => {
                            /* navigate to People page */
                          }}
                        >
                          View full Person profile
                        </StyledButton>
                      </StyledFlex>
                    </>
                  ) : null}
                </StyledFlex>
              </StyledCard>
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
      ) : (
        <EmptyTable title="Conversations" />
      )}
    </>
  );
};

export default ConversationHistoryTab;

ConversationHistoryTab.propTypes = {
  ticket: PropTypes.shape({
    address: PropTypes.string,
    agentCategoryId: PropTypes.string,
    assignedAgent: PropTypes.shape({
      agentName: PropTypes.string,
      agentId: PropTypes.string,
      assignedBy: PropTypes.string,
      organizationId: PropTypes.string,
    }),
    createdDateTime: PropTypes.string,
    // TODO: customFields: PropTypes. (currently null)
    id: PropTypes.string,
    // TODO: notifiedUserIds: PropTypes. (currently null)
    requestedBy: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
      personId: PropTypes.string,
    }),
    sessionId: PropTypes.string,
    status: PropTypes.string,
    statusNotes: PropTypes.arrayOf(
      PropTypes.shape({
        action: PropTypes.string,
        createdDate: PropTypes.string,
        description: PropTypes.string,
        title: PropTypes.string,
      })
    ),
    ticketRequestName: PropTypes.string,
    trackNumber: PropTypes.string,
    updatedDateTime: PropTypes.string,
  }),
};
