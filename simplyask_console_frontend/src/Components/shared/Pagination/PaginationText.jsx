import PropTypes from 'prop-types';
import React from 'react';

import Spinner from '../Spinner/Spinner';

const PaginationText = ({
  pagination,
  isLoading,
  isProcessManagerView,
  isTestManagerView,
  isEntryAgentView,
  isChatWidgetView,
  isAgentManagerView,
}) => {
  const textDataSet = [
    { value: isTestManagerView, label: 'Test Suites' },
    { value: isProcessManagerView, label: 'Processes' },
    { value: isChatWidgetView, label: 'Chat Widgets' },
    { value: isEntryAgentView, label: 'Entry Agents' },
    { value: isAgentManagerView, label: 'Agents' },
  ];

  if (isLoading) {
    return (
      <Spinner inline extraSmall />
    );
  }

  return (
    <div>
      Showing
      {' '}
      {pagination?.startingPoint}
      {' '}
      -
      {' '}
      {pagination?.endingPoint}
      {' '}
      of
      {' '}
      {pagination?.totalElements}
      {' '}

      {(() => {
        const checkIfAnyViewExists = textDataSet.find((item) => item.value);
        if (checkIfAnyViewExists) return checkIfAnyViewExists.label;
        return 'items';
      })()}
    </div>
  );
};

export default PaginationText;

PaginationText.propTypes = {
  pagination: PropTypes.object,
  isLoading: PropTypes.bool,
  isTestManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isChatWidgetView: PropTypes.bool,
  isEntryAgentView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
};
