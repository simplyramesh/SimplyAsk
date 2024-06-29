import { useTheme } from '@emotion/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { useUser } from '../../../../../contexts/UserContext';
import { getInFormattedUserTimezone } from '../../../../../utils/timeUtil';
import NoDataFound, { NO_DATA_MY_SUMMARY_TEXTS } from '../../../../shared/NoDataFound/NoDataFound';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledEmptyValue, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { SUMMARY_TABS } from '../../../helpers';
import MyIssuesStats from '../MyIssuesStats/MyIssuesStats';
import {
  StyledMyIssuesPreview,
  StyledMyIssuesPreviewTable,
  StyledMyIssuesPreviewTableCell,
} from './StyledMyIssuesPreview';
import useGetIssues from '../../../../../hooks/issue/useGetIssues';
import { useNavigate } from 'react-router-dom';
import routes from '../../../../../config/routes';
import { ISSUES_QUERY_KEYS, ISSUE_CATEGORIES } from '../../../../Issues/constants/core';

const MyIssuesPreview = ({ switchToTab }) => {
  const { colors } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();

  const pageSize = 10;

  const { issues: data, isLoading } = useGetIssues({
    queryKey: ISSUES_QUERY_KEYS.GET_MY_ISSUES,
    filterParams: {
      assignedTo: user?.id,
      pageSize,
    },
    options: {
      enabled: !!user,
    },
  });

  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (data?.content) {
      setIssues(data.content);
    }
  }, [data]);

  const issuesContent = () => {
    const sortByDueDate = (a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    };

    const { overdueIssues, dueTodayIssues, workingOnIssues } = issues.reduce(
      (acc, item) => {
        if (item?.dueDate && moment().isAfter(item.dueDate, 'days')) {
          acc.overdueIssues.push(item);
        } else if (item?.dueDate && moment().isSame(item.dueDate, 'days')) {
          acc.dueTodayIssues.push(item);
        } else {
          acc.workingOnIssues.push(item);
        }

        return acc;
      },
      { overdueIssues: [], dueTodayIssues: [], workingOnIssues: [] }
    );

    return (
      <>
        {overdueIssues.length ? previewIssueTable('overdue', overdueIssues.sort(sortByDueDate), true) : null}
        {dueTodayIssues.length ? previewIssueTable('due today', dueTodayIssues.sort(sortByDueDate)) : null}
        {workingOnIssues.length ? previewIssueTable('working on', workingOnIssues.sort(sortByDueDate)) : null}
      </>
    );
  };

  const previewIssueTable = (title, data, titleHighlight) => {
    return (
      <StyledFlex>
        <StyledText mb="18" size={16} lh={20} weight={800} color={titleHighlight && colors.statusOverdue} uppercase>
          {title}
        </StyledText>

        <StyledMyIssuesPreviewTable>
          {data.map((item, index) => {
            return (
              <StyledFlex key={index} direction="row" width="100%">
                <StyledMyIssuesPreviewTableCell
                  alignItems="start"
                  onClick={() => {
                    const { category, id, parent } = item;

                    if (category === ISSUE_CATEGORIES.SERVICE_TICKET) {
                      navigate(`${routes.TICKETS}/${id}`);
                    } else if (category === ISSUE_CATEGORIES.FALLOUT_TICKET) {
                      navigate(`${routes.FALLOUT_TICKETS}/${id}`);
                    } else if (category === ISSUE_CATEGORIES.SERVICE_TICKET_TASK) {
                      navigate(`${routes.TICKETS}/${parent}?tab=ticketTasks`);
                    }
                  }}
                >
                  <StyledText size={16} lh={20} weight={600} mb="4">
                    {item?.displayName}
                  </StyledText>
                  <StyledText size={14} lh={17}>
                    {item?.id}
                  </StyledText>
                </StyledMyIssuesPreviewTableCell>
                <StyledMyIssuesPreviewTableCell>
                  <StyledText>{item?.category}</StyledText>
                </StyledMyIssuesPreviewTableCell>
                <StyledMyIssuesPreviewTableCell alignItems="end">
                  <StyledText>
                    {getInFormattedUserTimezone(item?.dueDate, user?.timezone, 'LLLL d, yyyy') || <StyledEmptyValue />}
                  </StyledText>
                </StyledMyIssuesPreviewTableCell>
              </StyledFlex>
            );
          })}
        </StyledMyIssuesPreviewTable>
      </StyledFlex>
    );
  };

  const noIssuesContent = () => (
    <NoDataFound
      title={NO_DATA_MY_SUMMARY_TEXTS.NO_DATA_ISSUES.title}
      customStyle={{
        minHeight: '290px',
        iconSize: '66px',
        titleFontSize: '16px',
      }}
    />
  );

  return (
    <StyledMyIssuesPreview>
      <StyledFlex direction="row" justifyContent="space-between" alignItems="center">
        <StyledText size={19} lh={23} weight={600}>
          My Issues
        </StyledText>
        {!isLoading && (
          <StyledButton tertiary variant="contained" onClick={(event) => switchToTab(event, SUMMARY_TABS.MY_ISSUES)}>
            Go to My Issues Page
          </StyledButton>
        )}
      </StyledFlex>

      {isLoading && <Spinner medium />}

      {!isLoading && (
        <>
          <MyIssuesStats />

          {issues && !!issues.length ? issuesContent() : noIssuesContent()}
        </>
      )}

      {!isLoading && issues && issues.length > pageSize && (
        <StyledFlex alignItems="start">
          <StyledButton variant="text" onClick={(event) => switchToTab(event, SUMMARY_TABS.MY_ISSUES)}>
            View {issues.length - pageSize} More Open Issues
          </StyledButton>
        </StyledFlex>
      )}
    </StyledMyIssuesPreview>
  );
};

export default MyIssuesPreview;

MyIssuesPreview.propTypes = {
  switchToTab: PropTypes.func,
};
