import PropTypes from 'prop-types';
import React from 'react';

import InsightsImg from '../../../Assets/icons/insights.svg?component';
import NoDataFoundImg from '../../../Assets/images/NoDataFound.png';
import { StyledButton } from '../REDISIGNED/controls/Button/StyledButton';

import {
  StyledNoDataFoundChild,
  StyledNoDataFoundImage,
  StyledNoDataFoundImageParent,
  StyledNoDataFoundParent,
  StyledNoDataFoundText,
  StyledNoDataFoundTextCaption,
  StyledNoDataFoundTextParent,
  StyledNoDataLink,
  StyledNoDataRoot,
} from './StyledNoDataFound';

const NO_DATA_ICONS = {
  insights: InsightsImg,
  default: NoDataFoundImg,
};

export const NO_PROCESSES_DATA_TEXTS = {
  NO_INITIAL_PROCESSES_DATA: {
    title: 'No Processes Found',
    body: 'You currently have no processes. Get started by creating a new process using the button in the top right',
  },

  NO_DATA_ON_PROCESSES_FILTER: {
    title: 'No Processes Found',
    body: 'No processes found for the applied filter',
  },

  NO_PROCESSES_DATA_ON_FAVORITES: {
    title: 'No Favorites Found',
    body: 'You currently don’t have any processes favourited',
  },

  NO_PROCESSES_DATA_ON_ARCHIVES: {
    title: 'No Archives Found',
    body: 'You currently don’t have any processes archived',
  },
};

export const NO_AGENTS_DATA_TEXTS = {
  NO_INITIAL_AGENTS_DATA: {
    title: 'No Agents Found',
    body: 'You currently have no agents. Get started by creating a new process using the button in the top right',
  },

  NO_DATA_ON_AGENTS_FILTER: {
    title: 'No Agents Found',
    body: 'No agents found for the applied filter',
  },

  NO_AGENTS_DATA_ON_FAVORITES: {
    title: 'No Favorites Found',
    body: 'You currently don’t have any agents favourited',
  },

  NO_AGENTS_DATA_ON_ARCHIVES: {
    title: 'No Archives Found',
    body: 'You currently don’t have any agents archived',
  },
};

export const NO_TEST_SUITES_DATA_TEXTS = {
  NO_INITIAL_TEST_SUITE_DATA: {
    title: 'No Test Suites Found',
    body: 'You currently have no test Suites. Get started by creating a new Test Suite using the button in the top right',
  },

  NO_DATA_ON_TEST_SUITE_FILTER: {
    title: 'No Test Suites Found',
    body: 'No test suites found for the applied filter',
  },

  NO_TEST_SUITE_DATA_ON_FAVORITES: {
    title: 'No Favorites Found',
    body: 'You currently don’t have any test suites favourited',
  },

  NO_TEST_SUITE_DATA_ON_ARCHIVES: {
    title: 'No Archives Found',
    body: 'You currently don’t have any test suites archived',
  },
};

export const NO_DATA_MY_SUMMARY_TEXTS = {
  NO_DATA_MY_CURRENTLY_ACTIVITY: {
    title: 'You Currently Have No New Activity',
  },
  NO_ACTIVITIES_FOUND: {
    title: 'No Activities Found',
    body: 'There are no results based on your current search and/or filters. Adjust your filters, and try again.',
  },
  NO_DATA_SIMPLYASK_INSIGHTS: {
    title: 'Check Back Later for New Insights',
  },
  NO_DATA_SHORTCUTS: {
    title: 'You Currently Have No Shortcuts',
  },
  NO_DATA_ISSUES: {
    title: 'You Currently Have No Open Issues',
  },
};

const NoDataFound = ({
  title = '', body, link, handleClickLink, customStyle = {},
}) => {
  const onClickLink = () => {
    if (typeof handleClickLink === 'function') {
      handleClickLink();
    }
  };

  return (
    <StyledNoDataRoot minHeight={customStyle?.minHeight}>
      <StyledNoDataFoundParent>
        <StyledNoDataFoundChild>
          <StyledNoDataFoundImageParent>
            <StyledNoDataFoundImage
              width={customStyle?.iconSize || customStyle?.iconWidth}
              height={customStyle?.iconHeight}
              src={NO_DATA_ICONS[customStyle?.iconName || 'default']}
              alt="No Data Icon"
            />
          </StyledNoDataFoundImageParent>
          <StyledNoDataFoundTextParent>
            <StyledNoDataFoundText
              fontSize={customStyle?.titleFontSize}
              lineHeight={customStyle?.titleLineHeight}
              fontWeight={customStyle?.titleFontWeight}
            >
              {title}
            </StyledNoDataFoundText>

            {(body || link) && (
              <StyledNoDataFoundTextCaption
                fontSize={customStyle?.bodyFontSize}
                lineHeight={customStyle?.bodyLineHeight}
                fontWeight={customStyle?.bodyFontWeight}
              >
                {body}
                {link && (
                  <StyledNoDataLink>
                    <StyledButton variant="text" onClick={onClickLink}>
                      {link}
                    </StyledButton>
                  </StyledNoDataLink>
                )}
              </StyledNoDataFoundTextCaption>
            )}
          </StyledNoDataFoundTextParent>
        </StyledNoDataFoundChild>
      </StyledNoDataFoundParent>
    </StyledNoDataRoot>
  );
};

export default NoDataFound;

NoDataFound.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  link: PropTypes.string,
  handleClickLink: PropTypes.func,
  customStyle: PropTypes.shape({
    minHeight: PropTypes.string,
    wrapperPadding: PropTypes.string,
    iconName: PropTypes.string,
    iconSize: PropTypes.string,
    iconWidth: PropTypes.string,
    iconHeight: PropTypes.string,
    titleFontSize: PropTypes.string,
    titleLineHeight: PropTypes.string,
    titleFontWeight: PropTypes.string,
    bodyFontSize: PropTypes.string,
    bodyLineHeight: PropTypes.string,
    bodyFontWeight: PropTypes.string,
  }),
};
