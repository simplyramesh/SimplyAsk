import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'simplexiar_react_components';

import { MANAGER_API_KEYS } from '../../../../../../config/managerKeys';
import Spinner from '../../../../Spinner/Spinner';
import classes from './ChangeTicketStatusModal.module.css';

const ChangeTicketStatusModal = ({
  setShowIsProcessStatusChanged,
  showIsProcessStatusChanged,
  clickedProcess,
  CHANGE_PROCESS_STATUS_SCHEMA,
  updateExistingProcessApi,
  fetchData,
  setShowSettingsSideDrawer,
}) => {
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleConfirmButton = async () => {
    setIsApiLoading(true);
    const data = {
      ...clickedProcess,
      [MANAGER_API_KEYS.STATUS]: showIsProcessStatusChanged.value.value,
    };

    const workflowId = clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID];

    try {
      const res = await updateExistingProcessApi(data, workflowId);
      if (res) {
        toast.success('The Process has been updated successfully...');
        setShowIsProcessStatusChanged(CHANGE_PROCESS_STATUS_SCHEMA);
        setShowSettingsSideDrawer(false);
        fetchData(true);
      }
    } catch (error) {
      toast.error('Something went wrong !!!');
    } finally {
      setIsApiLoading(false);
    }
  };
  if (!clickedProcess || isApiLoading) return <Spinner inline />;
  return (
    <div className={classes.root}>
      <div className={classes.closeIconRoot} onClick={() => setShowIsProcessStatusChanged(CHANGE_PROCESS_STATUS_SCHEMA)}>
        <CloseIcon className={classes.closeIconSvg} />
      </div>

      <div className={classes.infoOutlinedIconRoot}>
        <InfoOutlinedIcon className={classes.infoOutlinedIcon} />
      </div>

      <div className={classes.are_you_sure}>
        Are you Sure?
      </div>

      <div className={classes.content}>
        You are about to change your Process status from
        {' '}
        <strong>
          {clickedProcess.status ?? '---'}
        </strong>
        {' '}
        to
        {' '}
        <strong>
          {showIsProcessStatusChanged?.value?.label ?? '---'}
        </strong>
        {' '}
      </div>

      <div className={`${classes.flex_row_buttons}`}>
        <Button
          className={classes.backButton}
          onClick={() => setShowIsProcessStatusChanged(CHANGE_PROCESS_STATUS_SCHEMA)}
        >
          Cancel
        </Button>
        <Button className={classes.continueBtn} type="submit" onClick={handleConfirmButton}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ChangeTicketStatusModal;

ChangeTicketStatusModal.propTypes = {
  setShowIsProcessStatusChanged: PropTypes.func,
  showIsProcessStatusChanged: PropTypes.object,
  clickedProcess: PropTypes.object,
  CHANGE_PROCESS_STATUS_SCHEMA: PropTypes.object,
  updateExistingProcessApi: PropTypes.func,
  fetchData: PropTypes.func,
  setShowSettingsSideDrawer: PropTypes.func,
};
