import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'simplexiar_react_components';

import { MANAGER_API_KEYS } from '../../../../../../config/managerKeys';
import Spinner from '../../../../Spinner/Spinner';
import classes from './MoveTicketStatusToArchiveModal.module.css';

const MoveTicketStatusToArchiveModal = ({
  setShowMoveElementToArchive,
  clickedProcess,
  runUpdateElementApi,
  isLoading,
  isTestManagerView,
  isProcessManagerView,
  isAgentManagerView,
}) => {
  const getNameAndStatus = () => {
    return {
      name: clickedProcess?.[MANAGER_API_KEYS.DISPLAY_NAME],
      status: clickedProcess?.[MANAGER_API_KEYS.IS_ARCHIVED],
    };
  };

  const getElementType = () => {
    if (isTestManagerView) return 'Test Suite';
    if (isProcessManagerView) return 'Process';
    if (isAgentManagerView) return 'Agent';
  };

  const triggerArchiveApi = () => {
    const apiData = {
      ...clickedProcess,
      [MANAGER_API_KEYS.IS_ARCHIVED]: !clickedProcess?.[MANAGER_API_KEYS.IS_ARCHIVED],
      [MANAGER_API_KEYS.IS_FAVORITE]: false,
    };

    const changeOnlyFavoriteLoading = false;
    const isProcessingArchiveApi = true;
    runUpdateElementApi(apiData, changeOnlyFavoriteLoading, isProcessingArchiveApi);
  };

  const handleArchiveClick = () => {
    return triggerArchiveApi();
  };

  const getShowAllElementsTabName = () => {
    if (isTestManagerView) return '“All Test Suites”';
    if (isProcessManagerView) return '“All Processes””';
    if (isAgentManagerView) return '“All Agents”';
  };

  if (!clickedProcess) return <Spinner fadeBgParentFixedPosition roundedBg />;

  return (
    <div className={classes.root}>
      {isLoading && <Spinner fadeBgParentFixedPosition roundedBg /> }
      <div className={classes.closeIconRoot} onClick={() => setShowMoveElementToArchive(false)}>
        <CloseIcon className={classes.closeIconSvg} />
      </div>

      <div className={classes.infoOutlinedIconRoot}>
        <InfoOutlinedIcon className={classes.infoOutlinedIcon} />
      </div>

      <div className={classes.are_you_sure}>
        Are you Sure?
      </div>

      <div className={classes.content}>
        You are about to
        {' '}
        {getNameAndStatus()?.status ? 'unarchive' : 'archive'}
        {' '}
        <strong>{getNameAndStatus()?.name}</strong>
        . This will
        {' '}
        <strong>
          {getNameAndStatus()?.status ? 'activate' : 'deactivate'}
        </strong>
        {' '}
        the
        {' '}
        {getElementType()}
        , and move it to the
        {' '}
        <strong>
          {getNameAndStatus()?.status ? getShowAllElementsTabName() : '“Archived”'}
        </strong>
        {' '}
        tab
      </div>

      <div className={`${classes.flex_row_buttons}`}>
        <Button
          className={classes.backButton}
          onClick={() => setShowMoveElementToArchive(false)}
        >
          Cancel
        </Button>
        <Button className={classes.continueBtn} type="submit" onClick={handleArchiveClick}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default MoveTicketStatusToArchiveModal;

MoveTicketStatusToArchiveModal.propTypes = {
  setShowMoveElementToArchive: PropTypes.func,
  clickedProcess: PropTypes.object,
  runUpdateElementApi: PropTypes.func,
  isLoading: PropTypes.bool,
  isTestManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,

};
